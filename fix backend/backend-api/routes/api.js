const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { getUsersHandler, registerUserHandler, loginHandler, updateProfileHandler, getUserByIdHandler, logoutHandler, uploadProfilePicture } = require('../handler/User');
const { verifyToken } = require('../middlewares/Auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/login', loginHandler);
router.post('/register', registerUserHandler);
router.get('/users', verifyToken, getUsersHandler);
router.get('/users/:userId', verifyToken, getUserByIdHandler);
router.delete('/logout', logoutHandler);

module.exports = router;