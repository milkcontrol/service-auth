const express = require("express");

const router = express.Router();

const userController = require("../controller/user.controller")

router.post('/create', userController.userCreate)
router.get('/:id', userController.getUSer)

module.exports = router

