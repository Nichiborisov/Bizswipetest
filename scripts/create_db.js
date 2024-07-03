const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/users.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        profile_picture TEXT,
        blog TEXT,
        vk_link TEXT,
        telegram_link TEXT,
        website_link TEXT
    )`);
});

db.close();
