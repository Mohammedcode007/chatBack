// controllers/messageController.js

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');


// Function to get all messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to create a new message
exports.createMessage = async (req, res) => {
    const { content, conversationId, sender, recipient } = req.body;

    try {
        // Check if the sender and recipient belong to the specified conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(400).json({ message: 'Conversation not found' });
        }
        const participants = conversation.participants.map(participant => participant.toString());
        if (!participants.includes(sender) || !participants.includes(recipient)) {
            return res.status(400).json({ message: 'Sender or recipient not part of the conversation' });
        }

        // Create a new message for the specified conversation
        const message = new Message({
            sender,
            recipient,
            content,
            conversation: conversationId,
            seen: false,
            delivered: false
        });

        const newMessage = await message.save();

        // Add the new message to the conversation
        conversation.messages.push(newMessage._id);
        await conversation.save();

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};





// Function to delete a message
exports.deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndRemove(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.startConversation = async (req, res) => {
    const { sender, recipient, content } = req.body;

    try {
        // Create a new message to initiate the conversation
        const message = new Message({
            sender,
            recipient,
            content,
            delivered: false // Assuming the message is not delivered yet
        });

        const newMessage = await message.save();

        // Check if there's already an existing conversation between the two users
        const existingConversation = await Conversation.findOne({
            participants: { $all: [sender, recipient] }
        });

        if (existingConversation) {
            // If the conversation exists, return its details along with message details
            const conversationWithMessages = await Conversation.findOne({ _id: existingConversation._id }).populate('messages');
            return res.status(200).json(conversationWithMessages);
        }

        // If the conversation doesn't exist, create it
        const conversation = new Conversation({
            participants: [sender, recipient],
            messages: [newMessage._id]
        });

        const newConversation = await conversation.save();

        // Populate message details and return
        const conversationWithNewMessage = await Conversation.findOne({ _id: newConversation._id }).populate('messages');

        res.status(201).json(conversationWithNewMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};





// عند استلام الرسالة
exports.messageReceived = async (req, res) => {
    const {messageId} = req.query; // Assume the message ID is provided in the request

    try {
        // Find the message by ID
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Update the "delivered" status to true
        await Message.updateOne({ _id: messageId }, { $set: { delivered: true } });

        res.json({ message: 'Message delivered' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteConversation = async (req, res) => {
    const conversationId = req.body; 
    console.log('5555');

};
