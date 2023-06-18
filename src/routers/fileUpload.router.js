const router = require('express').Router()
const FileUploadController = require('../modules/FileUpload/FileUpload.controller')
const Controller = new FileUploadController()

router.post('/upload', Controller.upload)
router.delete('/remove', Controller.removeFile)

module.exports = router