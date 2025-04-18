const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')


const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(cors());
app.use(express.json());

const port = 5000;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "digcity"

})

// Konfigurasi CORS dengan benar
app.use(cors({ 
    credentials: true, 
    origin: "http://localhost:3000" // Sesuaikan dengan port frontend React Anda
  }));

app.get("/anggota", (req, res) => {
    const sql = "SELECT * FROM data_anggota";
    db.query(sql, (err, result) => {
      if (err) res.json({ message: "Server error" });
      return res.json(result);
    });
  });

app.get('/anggota/stats', (req, res) => {
    const sql = `
      SELECT
        COUNT(*) AS total_users,
        SUM(CASE WHEN status_keanggotaan = 'Aktif' THEN 1 ELSE 0 END) AS active_users,
        SUM(CASE WHEN status_keanggotaan != 'Aktif' THEN 1 ELSE 0 END) AS inactive_users,
        SUM(CASE WHEN sanksi = 'Baik' THEN 1 ELSE 0 END) AS predikat_baik,
        SUM(CASE WHEN sanksi != 'Baik' THEN 1 ELSE 0 END) AS predikat_buruk
      FROM data_anggota
    `;
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: "Server error" });
      res.json(result[0]);
    });
  });
  

app.listen(port, () => {
    console.log(`listening on port ${port} `);
  })