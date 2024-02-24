const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imageProcessing = require('../imageProcessing');

// test image paths
const basic_image_path = path.join(__dirname, 'testImages', 'basic_image.jpg');

// test image buffers
const basic_image_buffer = fs.readFileSync(basic_image_path);

/**
 * Creates test image.
 * @param {Number} width - image width
 * @param {Number} height - image height
 * @param {Number} red - amount of red (0-255)
 * @param {Number} green - amount of green (0-255)
 * @param {Number} blue - amount of blue (0-255)
 * @returns image buffer
 */
async function createTestImage(width, height, red, green, blue) {
    const buffer = await sharp({
        create: {
            width: width,
            height: height,
            channels: 3,
            background: { r: red, g: green, b: blue }
        }
    }).jpeg().toBuffer();

    return buffer;
}

describe('Image Processing', () => {
    describe('stretch', () => {
        it("should stretch the image correctly", async () => {
            // original image
            const originalMetadata = await sharp(basic_image_path).metadata();
            const originalWidth = originalMetadata.width;
            const originalHeight = originalMetadata.height;

            // processed image
            const processedImage = await imageProcessing.stretch(basic_image_buffer, 100);
            const processedMetadata = await sharp(processedImage).metadata();

            // expected values
            const expectedWidth = Math.floor(originalWidth * 1.5);
            const expectedHeight = Math.floor(originalHeight / 1.5);
            expect(processedMetadata.width).toEqual(expectedWidth);
            expect(processedMetadata.height).toEqual(expectedHeight);
        });

        it("should stretch the image correctly", async () => {
            // original image
            const originalWidth = 100;
            const originalHeight = 200;
            const originalImage = await createTestImage(originalWidth, originalHeight, 255, 255, 255); // full white image 100x200

            // processed image
            const processedImage = await imageProcessing.stretch(originalImage, 100);
            const processedMetadata = await sharp(processedImage).metadata();

            // expected values
            const expectedWidth = Math.floor(originalWidth * 1.5);
            const expectedHeight = Math.floor(originalHeight / 1.5);
            expect(processedMetadata.width).toEqual(expectedWidth);
            expect(processedMetadata.height).toEqual(expectedHeight);
        });

        it("should keep the resolution if processed with 0 intensity", async () => {
            // original image
            const originalMetadata = await sharp(basic_image_path).metadata();
            const originalWidth = originalMetadata.width;
            const originalHeight = originalMetadata.height;

            // processed image
            const processedImage = await imageProcessing.stretch(basic_image_buffer, 0);
            const processedMetadata = await sharp(processedImage).metadata();

            // expected values
            expect(processedMetadata.width).toEqual(originalWidth);
            expect(processedMetadata.height).toEqual(originalHeight);
        });

        it("should throw error if new width would become too large", async () => {
            // original image
            const originalWidth = 7680;
            const originalHeight = 4320;
            const originalImage = await createTestImage(originalWidth, originalHeight, 255, 255, 255); // full white image 100x200

            // processed image
            await expect(imageProcessing.stretch(originalImage, 50)).rejects.toThrowError();
        });

        it("should throw error if new height would become too large", async () => {
            // original image
            const originalWidth = 7680;
            const originalHeight = 4320;
            const originalImage = await createTestImage(originalWidth, originalHeight, 255, 255, 255); // full white image 100x200

            // processed image
            await expect(imageProcessing.stretch(originalImage, -50)).rejects.toThrowError();
        });

        it("should throw error if new height would become invalid", async () => {
            // original image
            const originalWidth = 100;
            const originalHeight = 1;
            const originalImage = await createTestImage(originalWidth, originalHeight, 255, 255, 255); // full white image 100x200

            // processed image
            await expect(imageProcessing.stretch(originalImage, 500)).rejects.toThrowError();
        });

        it("should throw error if new width would become invalid", async () => {
            // original image
            const originalWidth = 1;
            const originalHeight = 200;
            const originalImage = await createTestImage(originalWidth, originalHeight, 255, 255, 255); // full white image 100x200

            // processed image
            await expect(imageProcessing.stretch(originalImage, -500)).rejects.toThrowError();
        });
    });
});