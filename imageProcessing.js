const sharp = require('sharp');

// maximum dimensions for processed image
const MAX_WIDTH = 7680;
const MAX_HEIGHT = 4320;

/**
 * Resized image by stretching its width and height, keeping the approximate pixel count.
 * @param {Buffer} image - image to stretch
 * @param {number} intensity - how strongly the image is being streched
 * @returns {Promise<Buffer>} - stretched image
 */
async function stretch(image, intensity) {
    // image metadata
    const metadata = await sharp(image).metadata();

    // scales width and height simultaneously with intensity
    const newWidthScale = 1 + (intensity / 200);
    const newWidth = Math.round(metadata.width * newWidthScale);
    const newHeight = Math.round(metadata.height / newWidthScale);

    // doesn't allow values that pass the maximum dimensions
    if (MAX_WIDTH < newWidth || MAX_HEIGHT < newHeight ) {
        throw new Error(`Processed image resolution (${newWidth}x${newHeight}) would exceed maximum dimensions (${MAX_WIDTH}x${MAX_HEIGHT})`);
    }

    // doesn't allow dimensions under 1
    if (newWidth < 1 || newHeight < 1) {
        throw new Error(`Processed image resolution (${newWidth}x${newHeight}) was invalid`);
    }
    
    return sharp(image)
        .resize({ width: newWidth, height: newHeight, fit: 'fill' })
        .toFormat(metadata.format)
        .toBuffer();
};

/**
 * Saturated image with given intensity.
 * @param {Buffer} image - image to be saturated
 * @param {number} intensity - how strongly saturation is applied
 * @returns {Promise<Buffer>} - saturated image
 */
async function saturate(image, intensity) {
    // image metadata
    const metadata = await sharp(image).metadata();

    // intensity validation
    if (intensity < -100) { // saturation can't be negative
        throw new Error(`Given intensity '${intensity}' was invalid (<100)`);
    }

    // multiplier for saturation
    const saturationMultiplier = 1 + (intensity / 100);
    return sharp(image)
        .modulate({ saturation: saturationMultiplier })
        .toFormat(metadata.format)
        .toBuffer();
}

/**
 * Reduces image file size by reducing the jpeg quality.
 * Keeps the file type after conversion.
 * @param {Buffer} image - image to be processed
 * @param {number} intensity - how strongly quality is decreased (1-100)
 * @returns {Promise<Buffer>} - image with modified jpeg quality
 */
async function reduceFileSize(image, intensity) {
    // image metadata
    const metadata = await sharp(image).metadata();

    // intensity validation
    if (isNaN(parseInt(intensity))) { // not integer
        throw new Error(`Given intensity '${intensity}' wasn't integer`);
    }

    // jpeg quality has to be in [1-100]
    if (intensity < 1 || 100 < intensity) {
        throw new Error(`Given intensity '${intensity}' wasn't in range [1-100]`);
    }

    // changing intensity -> jpeg quality (flipping min & max)
    const quality = 100 - (intensity - 1);
    return sharp(image)
        .jpeg({ quality: quality })
        .toFormat(metadata.format)
        .toBuffer();
};

/**
 * Reduces image resoltution by sizing it down.
 * @param {Buffer} image - image to be processed
 * @param {number} intensity - how strongly resolution is decreased
 * @returns {Promise<Buffer>} - image with reduced resolution
 */
async function reduceResolution(image, intensity) {
    if (intensity < 0) {
        throw new Error(`Given intensity '${intensity}' was invalid (<0)`);
    }

    // image metadata for dimensions
    const metadata = await sharp(image).metadata();

    // multiplier = 1 / (intensity% + 1) 
    const resolutionMultiplier = 1 / (0.01 * intensity + 1);

    // higher intensity -> lower quality
    let newWidth = parseInt(metadata.width * resolutionMultiplier);
    let newHeight = parseInt(metadata.height * resolutionMultiplier);

    // sets to 1 if becomes too small
    if (newWidth <= 0)  {
        newWidth = 1;
    }
    if (newHeight <= 0) {
        newHeight = 1;
    }

    return sharp(image)
        .resize({ width: newWidth, height: newHeight })
        .toFormat(metadata.format)
        .toBuffer();
};

// available functions
const functions = {
    Normal: stretch,
    Defrosting: saturate,
    Grill: reduceFileSize,
    Popcorn: reduceResolution
};

/**
 * Processed image with given mode and intensity.
 * @param {Buffer} image - image to be processed
 * @param {String} mode - processing mode to be applied
 * @param {number} intensity - how strongly the mode is applied
 * @returns {Promise<Buffer>} - processed image
 * @throws {Error} - if mode isn't supported or error occurs in image processing 
 */
async function processImage(image, mode, intensity) {
    // throws error if mode isn't in the keys
    if (!Object.keys(functions).includes(mode)) {
        throw new Error(`Unsupported mode: '${mode}'`);
    }

    // tries to process given mode
    return await functions[mode](image, intensity);
};

module.exports = {
    processImage: processImage,
    modes: Object.keys(functions),
    stretch: stretch,
    saturate: saturate,
    reduceFileSize: reduceFileSize,
    reduceResolution: reduceResolution
};