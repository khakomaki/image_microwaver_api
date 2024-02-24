const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imageProcessing = require('../imageProcessing');

// test image paths
const basic_image_path = path.join(__dirname, 'testImages', 'basic_image.jpg');

// test image buffers
const basic_image_buffer = fs.readFileSync(basic_image_path);

describe('Image Processing', () => {
    describe('stretch', () => {
        it('should stretch the image correctly', async () => {
            // original image
            const originalMetadata = await sharp(basic_image_path).metadata();
            const originalWidth = originalMetadata.width;
            const originalHeight = originalMetadata.height;

            // processed image
            const processedImage = await imageProcessing.stretch(basic_image_buffer, 100);
            const processedMetadata = await sharp(processedImage).metadata();

            expect(processedMetadata.width).toEqual(originalWidth * 1.5);
            expect(processedMetadata.height).toEqual(originalHeight / 1.5);
        });
    });
});