const supported_file_types = [ 'JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF', 'TIFF' ];

/**
 * Returns file extension.
 * Returns null if no file extension is found.
 * @param {String} filename 
 * @returns {String} file extension
 */
function getExtension(filename) {
    const fileParts = filename.split('.');

    // no file extension if under 2 parts
    if (fileParts.length < 2) {
        return null;
    }

    // return last part
    return fileParts[fileParts.length - 1];
}

/**
 * Returns true if given filename is of supported type.
 * @param {String} filename 
 * @returns {Boolean} is the filename supported
 */
function isSupportedType(filename) {
    const fileExtension = getExtension(filename);
    if (fileExtension) {
        return supported_file_types.includes(fileExtension.trim().toUpperCase());
    }

    return false;
}

module.exports = {
    getExtension,
    isSupportedType
}