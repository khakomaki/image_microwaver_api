const sharp = require('sharp');

const strech = async (image, intensity, min=-99, max=100) => {
    // throws error if the intensity isn't in the range
    if (intensity < min || max < intensity) {
        throw new Error(`Given intensity '${intensity}' wasn't in the range [${min} - ${max}]`);
    }

    const metadata = await sharp(image).metadata();

    // scales width with intensity%
    const newWidthScale = 1 + (intensity / 100);
    const newWidth = Math.round(metadata.width * newWidthScale);
    return sharp(image)
        .resize({ width: newWidth, height: metadata.height, fit: 'fill' })
        .toBuffer();
};

const saturate = async (image, intensity, min=-100, max=100) => {
    // throws error if the intensity isn't in the range
    if (intensity < min || max < intensity) {
        throw new Error(`Given intensity '${intensity}' wasn't in the range [${min} - ${max}]`);
    }

    // multiplier for saturation
    const saturationMultiplier = 1 + (intensity / 100);
    return sharp(image)
        .modulate({ saturation: saturationMultiplier })
        .toBuffer();
}

const reduceFileSize = async (image, intensity, min=1, max=100) => {
    // throws error if the intensity isn't in the range
    if (intensity < min || max < intensity) {
        throw new Error(`Given intensity '${intensity}' wasn't in the range [${min} - ${max}]`);
    }

    // changing intensity -> jpeg quality (flipping min & max)
    const quality = max - (intensity - min);

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