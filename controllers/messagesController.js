const Message = require("../models/Message")

const messagesController = {
    getMessage: async (req, res, next) => {
        const key = req.params.key
        res.locals.message = `RetrievedMessage for key of: ${key}`;
        next();
    },

    storeMessage: async (req, res, next) => {
        const { name, email, message } = req.body;
        const errors = [];

        if (!name) errors.push("Please include a name.");
        if (!email) errors.push("Please include a valid email.")
        if (!message) errors.push("Please include a message.")
        if (message && message.length > 250) errors.push("Message length must be 250 characters or less.")   
        
        if (errors.length) {
            let errorMessage = '';
            for (const e of errors) {
                errorMessage += `${e} `
            }
            
            res.locals.status = 400;

            res.locals.message = {
                success: false,
                error: errorMessage.trim(),
                token: null
            }
            return next()
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
            console.log(`Error in messagesController.storeMessage: ${e.message}`);
            res.locals.status = 500;
            res.locals.message = {
                success: false,
                error: `Internal server error in messagesController.storeMessage: ${e.message}`,
                token: null
            };
            
            return next();
        }
    }

}

module.exports = messagesController;