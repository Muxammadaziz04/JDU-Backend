const DecanServices = require('./decan.service.js')
const ExpressError = require('../../errors/express.error');
const { uploadFile, removeFile } = require('../../services/file.service.js');

class DecanController {
    async update(req, res, next) {
        try {
            const body = req.body
            const avatar = req.files?.avatar

            if (avatar) {
                const decanAvatar = await uploadFile({ file: avatar })
                if (decanAvatar.url) {
                    body.avatar = decanAvatar.url
                    const prevValues = await DecanServices.getMe()
                    prevValues.dataValues?.avatar && await removeFile(prevValues.dataValues?.avatar)
                } else throw new ExpressError(decanAvatar?.message || 'avatar is not uploaded')
            }

            if (body.password && !body.currentPassword) {
                res.status(409).send(new ExpressError('current password is required', 409))
                return
            } else if (body.password && body.confirmPassword === body.password) {
                const decan = await DecanServices.checkPassword(body.currentPassword)
                if (!decan || decan.error) {
                    res.status(409).send(new ExpressError('current password is not correct', 409))
                    return
                }
            } else if (body.password && body.confirmPassword !== body.password) {
                res.status(409).send(new ExpressError('confirm password is not correct', 409))
                return
            }
            
            const decan = await DecanServices.update(body)

            if(!decan || decan?.error) {
                throw new ExpressError(decan?.message, decan?.status)
            }

            res.status(203).send(decan)
        } catch (error) {
            next(error)
        }
    }

    async getDecan(req, res, next) {
        try {
            const decan = await DecanServices.getMe()
            res.status(200).send(decan)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = DecanController