
class ImageProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = "ImageProcessingError";
    }
}

class InvalidURLError extends ImageProcessingError {
    constructor(url) {
        super(`Invalid URL: ${url}`);
        this.name = "InvalidURLError";
        this.url = url;
    }
}

class FileReadError extends ImageProcessingError {
    constructor(message) {
        super(message);
        this.name = "FileReadError";
    }
}


module.exports = {ImageProcessingError,InvalidURLError,FileReadError};
