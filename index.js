const cors = require('cors');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const imageProcessor = require('./imageProcessing')
const app = express();

const port = 3001;
const maxFileSize = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage, 
    limits: { fileSize: maxFileSize } 
}).single('image');

app.use(cors());
app.use(bodyParser.json());

app.post('/process-image', (req, res) => {
    upload(req, res, async (err) => {
        // handles errors in image upload
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                console.log(`Uploaded image exceeded maximum file size`);
                return res.status(400).json({ error: `Image exceeds the maximum file size` });
            } else {
                console.log(`Unexpected error in image upload: ${err}`);
                return res.status(400).json({ error: `Internal server error` });
            }
        }
        
        const { mode, intensity } = req.body;
        const imageBuffer = req.file.buffer;

        // checks that intensity is a number
        intensityFloat = parseFloat(intensity);
        if (isNaN(intensityFloat)) {
            return res.status(400).json({ error: `Given intensity '${intensity}' wasn't a number` });
        }

        // processes image
        try {
            const processedImage = await imageProcessor(imageBuffer, mode, intensityFloat);

            // sends the processed image back
            res.set('Content-Type', 'image/jpeg');
            res.send(processedImage);
        } catch (error) {
            console.error(`Error in processing image: ${error.message}`);
            return res.status(400).json({ error: error.message });
        }
    });
});

app.get('/', (req, res) => {
    res.send(`You've landed on root path`);
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});