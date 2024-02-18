// userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../Utils/authUtils');
const FriendRequest = require('../models/FriendRequest');

exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Sending all user data including ID and username
        res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Username not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate a token upon successful login
        const token = generateToken(user.id);

        // Sending all user data including ID and username
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchByUserId = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// userController.js

// userController.js

exports.searchByUsername = async (req, res) => {
    const { username } = req.query;
    const { userId } = req.query; // ID of the user who is performing the search

    try {
        // Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user who searched for this user has previously sent a friend request
        const friendRequest = await FriendRequest.findOne({ sender: userId, receiver: user._id });
        let friendRequestSent = false;
        if (friendRequest) {
            friendRequestSent = true;
        }

        // Update the lastSearchBy and lastSearchRequestSent fields for the searched user
        user.lastSearchBy = userId;
        user.lastSearchRequestSent = friendRequestSent; // Set lastSearchRequestSent based on the search result
        await user.save();

        res.status(200).json({ user, friendRequestSent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

