const logger = require("../../services/logger.service");
const { uploadFile, removeFile } = require("../../services/file.service");

class FileUploadController {
    async upload(req, res) {
        try {
            const fileData = await uploadFile({ file: req.files.file })
            res.status(201).send(fileData)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async removeFile(req, res) {
        try {
            await removeFile(req.body.url)
            res.status(204).end()
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = FileUploadController