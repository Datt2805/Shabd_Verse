const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Reusable function to upload a file to ImageKit.
 * @param {Buffer} fileBuffer - The file content as a buffer.
 * @param {string} fileName - The name of the file.
 * @returns {Promise<Object>} - The file URL and fileId.
 */
const uploadToImageKit = async (fileBuffer, fileName) => {
    try {
        const response = await imagekit.upload({
            file: fileBuffer, // can be a buffer, base64, or remote URL
            fileName: fileName,
            folder: '/book_exchange_uploads'
        });

        return {
            url: response.url,
            fileId: response.fileId,
            thumbnailUrl: response.thumbnailUrl
        };
    } catch (error) {
        console.error('ImageKit Upload Error:', error);
        throw new Error('Failed to upload to ImageKit');
    }
};

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadResult = await uploadToImageKit(
            req.file.buffer,
            `${Date.now()}-${req.file.originalname}`
        );

        res.status(200).json(uploadResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadImage,
    uploadToImageKit
};
