const path = require('path');
const request = require('supertest');
const { app, close } = require('../index');

// test image paths
const basic_image_path = path.join(__dirname, 'testImages', 'basic_image.jpg');

describe('GET /', () => {
    it("should return welcome message", async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toBe("You've landed on root path");
    });
});

describe('POST /process-image', () => {
    /* ========== parameters ========== */
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

    /* ========== image ========== */
});

// closes the server after tests
afterAll(async () => {
    await close();
});