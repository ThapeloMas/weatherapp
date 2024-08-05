const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const port = 5000;

const SECRET_KEY = "your_secret_key"; // Use a secure key for production

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:"); // Use a persistent file for production

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS weather (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT,
    currentWeather TEXT,
    forecast TEXT
  )`);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  stmt.run(email, hashedPassword, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id: this.lastID });
  });
  stmt.finalize();
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ token });
  });
});

app.post("/weather", (req, res) => {
  const { city, currentWeather, forecast } = req.body;
  const stmt = db.prepare(
    "INSERT INTO weather (city, currentWeather, forecast) VALUES (?, ?, ?)"
  );
  stmt.run(
    city,
    JSON.stringify(currentWeather),
    JSON.stringify(forecast),
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ id: this.lastID });
    }
  );
  stmt.finalize();
});

app.get("/weather", (req, res) => {
  db.all("SELECT * FROM weather", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

app.delete("/weather/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM weather WHERE id = ?");
  stmt.run(id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ deleted: this.changes });
  });
  stmt.finalize();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
