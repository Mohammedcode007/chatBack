// routers/messageRouter.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/get_messages', messageController.getAllMessages);
router.post('/create_message', messageController.createMessage);
router.delete('/:id', messageController.deleteMessage);
router.post('/start-conversation', messageController.startConversation);
router.post('/delete_conversation', messageController.deleteMessage);

router.post('/receive-message', messageController.messageReceived);

module.exports = router;
