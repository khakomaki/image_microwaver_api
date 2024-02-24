const request = require('supertest');
const { app, close } = require('../index');

describe('GET /', () => {
    it('should return welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe("You've landed on root path");
    });
});

// closes the server after tests
afterAll(() => {
    close();
});