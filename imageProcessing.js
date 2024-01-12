const sharp = require('sharp');

const strech = async (image, intensity) => {
    // image metadata for dimensions
    const metadata = await sharp(image).metadata();

    // scales width with intensity%
    const newWidthScale = 1 + (intensity / 100);
    const newWidth = Math.round(metadata.width * newWidthScale);
    return sharp(image)
        .resize({ width: newWidth, height: metadata.height, fit: 'fill' })
        .toBuffer();
};

const saturate = async (image, intensity) => {
    // intensity validation
    if (intensity < -100) { // saturation can't be negative
        throw new Error(`Given intensity '${intensity}' is invalid (<100)`);
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
        throw new Error(`Given intensity '${intensity}' wasnt't in range [1-100]`);
    }

    // changing intensity -> jpeg quality (flipping min & max)
    const quality = 100 - (intensity - 1);

    return sharp(image)
        .jpeg({ quality: quality })
        .toBuffer();
};

const functions = {
    Normal: strech,
    Defrosting: saturate,
    Grill: reduceFileSize
};

const processImage = async (image, mode, intensity) => {
    // throws error if mode isn't found
    if (!functions[mode]) {
        throw new Error(`Unsupported mode: '${mode}'`);
    }

    // tries to process given mode
    return await functions[mode](image, intensity);
};

module.exports = processImage;