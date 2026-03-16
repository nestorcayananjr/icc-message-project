const Message = require("../models/Message")

const markAsInvalid = async (key) => {
    try {
        await Message.findByIdAndUpdate(key, { valid: false})
        return;
    } catch(e){
        res.locals.status(500)
        res.locals.message = {
            success: false,
            error: `Error updating message: ${e.message}`,
            token: null
        };
        
        return next();
    }
}

module.exports = markAsInvalid
