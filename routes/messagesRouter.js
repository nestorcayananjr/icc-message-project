const express = require('express')
const messagesController = require('../controllers/messagesController.js')

const router = express.Router();

router.get('/:key', messagesController.getMessage, (req, res) => {
    res.status(res.locals.status).json(res.locals.message)
})

router.post('/', messagesController.storeMessage, (_req, res) => {
    res.status(res.locals.status).json(res.locals.message)
}) 

module.exports = router;