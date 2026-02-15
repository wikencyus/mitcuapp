const express = require("express");
const OpenAI = require("openai");
const path = require("path");
require('dotenv').config();

const app = express();
const port = 8009;

// Inisialisasi Groq client - LANGSUNG PAKAI API KEY
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,// GANTI dengan API key Groq-mu!
  baseURL: "https://api.groq.com/openai/v1"
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/main/i_link.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main", "i_link.html"));
});

// Route API dengan Groq
app.post("/api/generate", async (req, res) => {
  try {
    const userPrompt = req.body.prompt || "Halo, apa kabar?";

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Kamu adalah Mitcu, asisten virtual yang keren dan gaul!
                    
Aturan main:
1. Namamu adalah "Mitcu" - panggil dirimu "Mitcu" atau "gw"
2. Jawab dengan SINGKAT dan PADAT (maksimal 2-3 kalimat)
3. Pakai bahasa GAUL anak muda:
   - Campur bahasa Indonesia dan Inggris (bahasa Jaksel)
   - Contoh: "Basically gitu loh", "literally", "which is", "btw", "anyway"
   - Pakai kata-kata kekinian: "santuy", "wkwk", "bangeet", "sih", "deh"
4. Kirim EMOJI di hampir setiap respons (minimal 1 emoji per pesan)
5. Ramah, asik, dan nggak kaku

Contoh gaya bicara:
- "Halo juga! How are you today? 😎"
- "Santuy aja bro, gue Groq siap bantu! 🔥"
- "Literally itu gampang banget, basically kamu tinggal... 👍"
- "Waduh error? Coba lagi ya, which is mungkin lagi sibuk 🤖"
- "Sip dah, done! Ada lagi yang bisa gue bantu? 👋"

INGAT: Singkat, gaul, campur Indo-Inggris, dan selalu pakai emoji!`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 256
    });

    res.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error("Error Groq:", error);
    res.status(500).json({
      error: error.message,
      text: "Waduh error bro! Lagi sibuk kali ye. Coba lagi nanti ya 😅✌️"
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Server jalan di http://localhost:${port}`);
  console.log(`📁 Chat box: http://localhost:${port}/main/i_link.html`);
  console.log(`🤖 Groq siap ngobrol gaul!`);
  console.log(`⚠️ Jangan lupa ganti API key-nya ya!`);
});

module.exports = app;