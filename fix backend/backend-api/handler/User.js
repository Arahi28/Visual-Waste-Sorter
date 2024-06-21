const { getUsers, registerUser, getUserByEmail, getUserByToken, getUserById, updateToken } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { firestore } = require('../config/database');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const registerUserHandler = async (req, res) => {
    const { email, name, password, role = "pengguna" } = req.body;

    const getUserRecord = await getUserByEmail(email);

    if (getUserRecord !== null) {
        res.status(400).json({ message: 'User already exists' });
    } else {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const userRecord = await registerUser(name, email, hash, role);
            res.status(200).json({ message: 'User registered successfully', data: userRecord });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

const loginHandler = async (req, res) => {
    try {
        const userRecord = await getUserByEmail(req.body.email);

        if (userRecord === null) {
            throw new Error('Invalid email');
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, userRecord.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const userId = userRecord.id;
        const email = userRecord.email;
        const name = userRecord.name;
        const role = userRecord.role; // Ambil peran pengguna dari userRecord
        const token = jwt.sign({ userId, email, name, role }, process.env.ACCESS_TOKEN_SECRET);

        await updateToken(userId, token);

        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        });

        res.status(200).json({ message: 'User logged in successfully', data: { userId, email, name, role, token } });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUsersHandler = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error getting users", error: error.message });
    }
};

const getUserByIdHandler = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error getting user", error: error.message });
    }
};

const logoutHandler = async (req, res) => {
    const refreshToken = req.cookies.token;

    try {
        const userRecord = await getUserByToken(refreshToken);

        if (userRecord.empty) {
            throw new Error('User not found');
        }
        const userId = userRecord.docs[0].id;
        await updateToken(userId, null);
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getUsersHandler, registerUserHandler, loginHandler, getUserByIdHandler, logoutHandler };