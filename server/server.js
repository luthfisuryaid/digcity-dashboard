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

app.use(cors({ 
  credentials: true, 
  origin: ["http://localhost:3000", "http://localhost:5173"]
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
        SUM(CASE WHEN LOWER(status_keanggotaan) = 'aktif' THEN 1 ELSE 0 END) AS active_users,
        SUM(CASE WHEN LOWER(status_keanggotaan) != 'aktif' THEN 1 ELSE 0 END) AS inactive_users,
        SUM(CASE WHEN LOWER(sanksi) = 'baik' THEN 1 ELSE 0 END) AS predikat_baik,
        SUM(CASE WHEN LOWER(sanksi) != 'baik' THEN 1 ELSE 0 END) AS predikat_buruk
      FROM data_anggota
    `;
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: "Server error" });
      res.json(result[0]);
    });
  });

  app.put("/anggota/:id", (req, res) => {
    const anggotaId = req.params.id;
    const updatedData = req.body;
    
    const sql = "UPDATE data_anggota SET ? WHERE id = ?";
    db.query(sql, [updatedData, anggotaId], (err, result) => {
      if (err) {
        console.error("Error updating member:", err);
        return res.status(500).json({ success: false, message: "Server error" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Anggota tidak ditemukan" });
      }
      
      // Ambil data yang telah diupdate untuk dikembalikan
      const selectSql = "SELECT * FROM data_anggota WHERE id = ?";
      db.query(selectSql, [anggotaId], (err, rows) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Server error" });
        }
        return res.json(rows[0]); // Kembalikan data anggota yang sudah diupdate
      });
    });
  });
  

app.listen(port, () => {
    console.log(`listening on port ${port} `);
  })