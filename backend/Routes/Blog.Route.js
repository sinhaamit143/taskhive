const express = require('express')
const router = express.Router()
const Controller = require('../Controller/Blog.Controller')
const { verifyAccessToken } = require('../helpers/jwt_helpers')

router.get('/public', Controller.publicList)
router.get('/get/:id', Controller.publicGet)

router.post('/', verifyAccessToken, Controller.create)
router.get('/:id', verifyAccessToken, Controller.get)
router.get('/', verifyAccessToken, Controller.list)
router.put('/:id', verifyAccessToken, Controller.update)
router.delete('/:id', verifyAccessToken, Controller.delete)
router.put('/:id/restore', verifyAccessToken, Controller.restore)

module.exports = router