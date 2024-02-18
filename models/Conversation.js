// models/Conversation.js

const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Participants in the conversation
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] // Messages exchanged in the conversation
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
