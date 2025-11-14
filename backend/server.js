import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Cek koneksi
app.get("/", (req, res) => {
  res.send("🚀 Backend e-commerce PostgreSQL berjalan!");
});

// Ambil semua data produk
app.get("/produk", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produk ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data produk" });
  }
});

// Proses resi dari frontend
app.post("/scan", async (req, res) => {
  const { no_resi } = req.body;

  try {
    // Cek apakah resi ada di tabel pengiriman / paket
    const result = await pool.query("SELECT * FROM paket WHERE no_resi = $1", [no_resi]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resi tidak ditemukan" });
    }

    res.json({ message: "Resi ditemukan", data: result.rows[0] });
  } catch (err) {
    console.error("Error saat memproses resi:", err);
    res.status(500).json({ message: "Gagal memproses resi" });
  }
});


// Tambah produk baru
app.post("/produk", async (req, res) => {
  const { nama, harga, stok } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO produk (nama, harga, stok) VALUES ($1, $2, $3) RETURNING *",
      [nama, harga, stok]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambahkan produk" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server aktif di http://localhost:${PORT}`));
