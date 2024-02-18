// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of user IDs
    lastSearchBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Last user who searched for this user
    lastSearchRequestSent: { type: Boolean, default: false } ,
    lastActive: { type: Date, default: Date.now }, // تاريخ آخر نشاط للمستخدم
    online: { type: Boolean, default: false }, // حالة الاتصال (متصل أو غير متصل)
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] // 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
