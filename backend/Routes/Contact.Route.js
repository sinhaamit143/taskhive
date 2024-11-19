const express = require('express')
const router = express.Router()
const Controller = require('../controller/contact.controller.js')
const { verifyAccessToken } = require('../helpers/jwt_helpers.js')

router.post('/', Controller.create)
router.get('/:id', verifyAccessToken, Controller.get)
router.get('/', verifyAccessToken, Controller.list)
router.put('/:id', verifyAccessToken, Controller.update)
router.delete('/:id', verifyAccessToken, Controller.delete)
router.put('/:id/restore', verifyAccessToken, Controller.restore)

module.exports = router
