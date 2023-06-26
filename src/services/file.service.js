const { default: axios } = require("axios");
const FormData = require("form-data");
const ExpressError = require("../errors/express.error");
const logger = require("./logger.service");
require('dotenv').config()

const api = axios.create({ baseURL: process.env.STORAGE_URL })

const uploadFile = async ({ file, folderName = '' }) => {
    try {
        if (!file) return {}

        const fd = new FormData()
        folderName && fd.append('folderName', folderName)
        const fileType = file?.mimetype?.split('/')?.[0]
        let url = ''

        if (fileType === 'image') {
            url = '/upload/image'
            fd.append('image', file?.data, file?.name)
        } else if (fileType === 'video') {
            url = '/upload/video'
            fd.append('video', file?.data, file?.name)
        } else {
            url = '/upload/file'
            fd.append('file', file?.data, file?.name)   
        }

        const res = await api.post(url, fd, { ...fd.getHeaders() })
        return res?.data
    } catch (error) {
        logger.error(error.message)
    }
}

const removeFile = async (url) => {
    try {
        if (!url) return new ExpressError('URL is not found', 400)

        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        const regex = new RegExp(expression);

        if (!url.match(regex)) return new ExpressError('File url is not correct', 400)

        const res = await api.delete('/remove', { data: { url } })
        return res?.data
    } catch (error) {
        logger.error(error.message)
    }
}

module.exports = {
    uploadFile, removeFile
}