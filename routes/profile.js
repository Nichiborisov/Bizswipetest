const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const db = new sqlite3.Database('./database/users.db');

// Настройка хранилища для загрузки изображений
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

router.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }

    db.get("SELECT * FROM users WHERE id = ?", [req.session.userId], (err, user) => {
        if (err) {
            return res.status(500).send("Error retrieving user data");
        }
        res.render('profile', { user });
    });
});

router.post('/update', upload.single('profile_picture'), (req, res) => {
    const { name, blog, vk_link, telegram_link, website_link } = req.body;
    let profile_picture = req.body.profile_picture || '';

    if (req.file) {
        profile_picture = req.file.buffer.toString('base64');
    }

    const userId = req.session.userId;

    db.run("UPDATE users SET name = ?, profile_picture = ?, blog = ?, vk_link = ?, telegram_link = ?, website_link = ? WHERE id = ?",
        [name, profile_picture, blog, vk_link, telegram_link, website_link, userId],
        (err) => {
            if (err) {
                return res.status(500).send("Error updating user profile");
            }
            res.redirect('/profile');
        });
});

router.get('/user/:id', (req, res) => {
    const userId = req.params.id;

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) {
            return res.status(500).send("Error retrieving user data");
        }
        res.render('profile', { user });
    });
});

module.exports = router;
