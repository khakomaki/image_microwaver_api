const sharp = require('sharp');

// maximum dimensions for processed image
const MAX_WIDTH = 7680;
const MAX_HEIGHT = 4320;

const stretch = async (image, intensity) => {
    // image metadata for dimensions
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
        .toBuffer();
};

const saturate = async (image, intensity) => {
    // intensity validation
    if (intensity < -100) { // saturation can't be negative
        throw new Error(`Given intensity '${intensity}' was invalid (<100)`);
    }

    // multiplier for saturation
    const saturationMultiplier = 1 + (intensity / 100);
    return sharp(image)
        .modulate({ saturation: saturationMultiplier })
        .toBuffer();
}

const reduceFileSize = async (image, intensity) => {
    // intensity validation
    if (isNaN(parseInt(intensity))) { // not integer
        throw new Error(`Given intensity '${intensity}' wasn't integer`);
    }

    if (intensity < 1 || 100 < intensity) { // jpeg quality has to be in [1-100]
        throw new Error(`Given intensity '${intensity}' wasn't in range [1-100]`);
    }

    // changing intensity -> jpeg quality (flipping min & max)
    const quality = 100 - (intensity - 1);
    return sharp(image)
        .jpeg({ quality: quality })
        .toBuffer();
};

const reduceResolution = async (image, intensity) => {
    if (intensity < 0) {
        throw new Error(`Given intensity '${intensity}' was invalid (<0)`);
    }

    // image metadata for dimensions
    const metadata = await sharp(image).metadata();

    // multiplier = 1 / (intensity% + 1) 
    const resolutionMultiplier = 1 / (0.01 * intensity + 1);

    // higher intensity -> lower quality
    let newWidth = parseInt(metadata.width * resolutionMultiplier);

    // sets to 1 if becomes too small
    if (newWidth <= 0) newWidth = 1;

    return sharp(image)
        .resize({ width: newWidth })
        .toBuffer();
};

const functions = {
    Normal: stretch,
    Defrosting: saturate,
    Grill: reduceFileSize,
    Popcorn: reduceResolution
};

const processImage = async (image, mode, intensity) => {
    // throws error if mode isn't in the keys
    if (!Object.keys(functions).includes(mode)) {
        throw new Error(`Unsupported mode: '${mode}'`);
    }

    // tries to process given mode
    return await functions[mode](image, intensity);
};

module.exports = {
    processImage: processImage,
    modes: Object.keys(functions)
};