const express = require('express')
const router = express.Router()
const Controller = require('../Controller/Auth.Controller')
const { verifyAccessToken } = require('../helpers/jwt_helpers')

router.post('/register', Controller.register)

router.post('/login', Controller.login)

module.exports = router
