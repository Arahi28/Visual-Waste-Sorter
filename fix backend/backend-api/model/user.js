const { firestore, FieldValue } = require("../config/database");

const registerUser = async (name, email, password, role) => {
    const userRecordRef = firestore.collection('users').doc();
    await userRecordRef.set({
        name: name,
        email: email,
        password: password,
        role: role,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
    });

    const userId = userRecordRef.id;
    const newUserRecord = await userRecordRef.get();
    
    return {
        id: userId,
        data: newUserRecord.data()
    };
};

const getUserByEmail = async (email) => {
    try {
        const userRecordRef = await firestore.collection('users').where('email', '==', email).get();
    
        if (userRecordRef.empty) {
            return null; 
        } else {
            const userRecord = userRecordRef.docs[0];
            const userRecordData = userRecord.data();
            userRecordData.id = userRecord.id;
            return userRecordData;
        }
    } catch (error) {
        console.error('Error retrieving user record:', error);
        throw error;    
    }
};

const getUsers = async () => {
    try {
        const users = [];
        const usersSnapshot = await firestore.collection('users').get();
        usersSnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        throw error;
    }
};

const getUserByToken = async (token) => {
    const userRecordRef = await firestore.collection('users').where('token', '==', token).get();
    return userRecordRef;
};

const getUserById = async (userId) => {
    try {
        const userRecordRef = firestore.collection('users').doc(userId);
        const userRecord = await userRecordRef.get();

        if(!userRecord.exists) {
            throw new Error('User not found');
        }

        return {
            id: userRecord.id,
            data: userRecord.data()
        };
    } catch (error) {
        console.error('Error retrieving user by ID:', error);
        throw error;
    }
};

const updateToken = async (userId, token) => {
    try {
        const userRecordRef = firestore.collection('users').doc(userId);
        await userRecordRef.update({
            token: token
        });
    } catch (error) {
        console.error('Error updating token:', error);
        throw error;
    }
};

module.exports = { getUsers, registerUser, getUserByEmail, getUserByToken, getUserById, updateToken };