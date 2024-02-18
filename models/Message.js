// models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false }, // Indicates if the message has been seen by the recipient
    delivered: { type: Boolean, default: false } // Indicates if the message has been delivered to the recipient
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
