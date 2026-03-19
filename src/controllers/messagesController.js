const Message = require("../models/Message")
const checkIfInLast24Hours = require("../utils/checkIfInLast24Hours.js")
const isValidEmail = require("../utils/isValidEmail.js")

const messagesController = {
    getMessage: async (req, res, next) => {
        const key = req.params.key;
        const errorMessage = {
            success: false,
            name: null,
            email: null,
            message: null,
            error: "Invalid or expired token"
        };

        try {
            const data = await Message.findOneAndUpdate(
                { _id: key, valid: true },
                { valid: false },
                { new: false }
            );

            if (!data){
                res.locals.status = 400;
                res.locals.message = errorMessage;
                return next();
            }

            const { name, email, message, updatedAt, valid } = data;
            const inLast24Hours = checkIfInLast24Hours(updatedAt);

            if (!valid || !inLast24Hours){
                res.locals.status = 400;
                res.locals.message = errorMessage;
                return next();
            }

            res.locals.status = 200;
            res.locals.message = {
                success: true,
                name,
                email,
                message,
                error: null
            }
            
            return next()
        } catch(e){
            if (e.name === 'CastError') {
                res.locals.status = 400;
                res.locals.message = errorMessage;
                return next();
            }

            res.locals.status = 500;
            res.locals.message = {
                success: false,
                error: `Internal server error in messagesController.getMessage: ${e.message}`,
                token: null
            };
            
            return next();
        }
    },

    storeMessage: async (req, res, next) => {
        const { name, email, message } = req.body;
        let errorMessage = '';

        if (!name || typeof name !== "string") errorMessage += "Please include a valid name value. "
        if (typeof email !== "string" || !isValidEmail(email)) errorMessage += "Please include a valid email value. "
        if (!message|| typeof message !== "string") errorMessage += "Please include a valid message value. "
        if (message && message.length > 250) errorMessage += "Message length must be 250 characters or less."
        
        if (errorMessage) {
            res.locals.status = 400;
            res.locals.message = {
                success: false,
                error: errorMessage.trim(),
                token: null
            }
            return next();
        }
            
        try {
            const newMessage = await Message.create({
                name: name,
                email: email,
                message: message,
            })

            res.locals.status = 200;

            res.locals.message = {
                success: true,
                error: null,
                token: newMessage._id
            }

            return next()
        } catch(e){
            res.locals.status = 500;
            res.locals.message = {
                success: false,
                error: `Internal server error in messagesController.storeMessage: ${e.message}`,
                token: null
            };
            
            return next();
        }
    },

}

module.exports = messagesController;