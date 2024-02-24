const path = require('path');
const request = require('supertest');
const { app, close } = require('../index');

// test image paths
const basic_image_path = path.join(__dirname, 'testImages', 'basic_image.jpg');
const unsupported_type_image_path_pix = path.join(__dirname, 'testImages', 'unsupported_file_type.pix');
const unsupported_type_image_path_jpg_pix = path.join(__dirname, 'testImages', 'unsupported_file_type.jpg.pix');
const multiple_types_image = path.join(__dirname, 'testImages', 'many.periods.and.file.types.png.gif.jpg');
const no_type_image = path.join(__dirname, 'testImages', 'file');
const no_name_image = path.join(__dirname, 'testImages', '.jpg');
// const too_large_image_path = path.join(__dirname, 'testImage', 'too_large_image_size.JPG');

describe('GET /', () => {
    it("should return welcome message", async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toBe("You've landed on root path");
    });
});

describe('POST /process-image', () => {
    
    /* ==================== parameters ==================== */

    it("should process image", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', basic_image_path)
            .field('mode', 'Normal')
            .field('intensity', 50);
        
        expect(response.status).toBe(200);
    });

    it("should throw error if intensity is invalid", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', basic_image_path)
            .field('mode', 'Normal')
            .field('intensity', 'invalid-intensity');
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Given intensity 'invalid-intensity' wasn't a number");
    });

    it("should throw error if mode is invalid", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', basic_image_path)
            .field('mode', 'invalid-mode')
            .field('intensity', 50);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Given mode 'invalid-mode' wasn't valid");
    });

    it("should throw error if parameters are missing", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', basic_image_path)
            .field('mode', 'Normal')
            // missing intensity field
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Intensity wasn't provided");
    });

    it("should throw error if parameters are missing", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', basic_image_path)
            // missing mode field
            .field('intensity', 50);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Mode wasn't provided");
    });

    it("should throw error if parameters are missing", async () => {
        const response = await request(app)
            .post('/process-image')
            // missing image attachment
            .field('mode', 'Normal')
            .field('intensity', 50);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Image wasn't provided");
    });

    it("should throw error if parameters are missing", async () => {
        const response = await request(app)
            .post('/process-image')
            // missing all parameters
        
        expect(response.status).toBe(400);
    });

    /* ==================== image ==================== */

    // TODO: test for uploading too large image

    it("should throw error if image file type isn't supported", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', unsupported_type_image_path_pix)
            .field('mode', 'Normal')
            .field('intensity', 50);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Uploaded file type wasn't supported");
    });

    it("should throw error if image file type isn't supported", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', unsupported_type_image_path_jpg_pix) // including jpg in file name shouldn't affect outcome
            .field('mode', 'Normal')
            .field('intensity', 50);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Uploaded file type wasn't supported");
    });

    it("should throw error if the uploaded file isn't image", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', no_type_image)
            .field('mode', 'Normal')
            .field('intensity', 50);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Uploaded file type wasn't supported");
    });

    it("should process image without name", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', no_name_image)
            .field('mode', 'Normal')
            .field('intensity', 50);
        
        expect(response.status).toBe(200);
    });

    it("should process image correctly with multiple file types in name", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', multiple_types_image)
            .field('mode', 'Normal')
            .field('intensity', 50);
        
        expect(response.status).toBe(200);
    });

    it("should process image without name", async () => {
        const response = await request(app)
            .post('/process-image')
            .attach('image', no_name_image)
            .field('mode', 'Normal')
            .field('intensity', 50);
        
        expect(response.status).toBe(200);
    });
});

// closes the server after tests
afterAll(async () => {
    await close();
});