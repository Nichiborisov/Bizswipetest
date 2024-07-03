const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database/users.db');

// Регистрация пользователя
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], (err) => {
        if (err) {
            return res.status(500).send("Error registering new user");
        }
        res.redirect('/auth/login');
    });
});

// Логин пользователя
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) {
            return res.status(500).send("Error logging in");
        }
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            res.redirect('/profile');
        } else {
            res.status(400).send("Invalid email or password");
        }
    });
});

// Logout пользователя
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;
