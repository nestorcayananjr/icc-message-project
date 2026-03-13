const messagesController = {
    getMessage: async (req, res, next) => {
        const key = req.params.key
        res.locals.message = `RetrievedMessage for key of: ${key}`;
        next();
    },

    storeMessage: async (req, res, next) => {
        res.locals.message = "Message stored"
        next();
    }

}

module.exports = messagesController;