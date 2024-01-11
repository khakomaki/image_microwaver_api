const cors = require('cors');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const imageProcessor = require('./imageProcessing')

const port = 3001;
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());

app.post('/process-image', upload.single('image'), async (req, res) => {
    const { image, mode, intensity } = req.body;
    const imageBuffer = req.file.buffer;

    try {
        // processes image
        const processedImage = await imageProcessor(imageBuffer, mode, intensity);

        // sends the processed image back
        res.set('Content-Type', 'image/jpeg');
        res.send(processedImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send(`You've landed on root path`);
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});