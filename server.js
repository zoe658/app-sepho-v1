const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ override: true });

const OpenAI = require("openai");

const app = express();
const PORT = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.json({ result: "Aucun prompt reçu." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en copywriting e-commerce."
        },
        {
          role: "user",
          content: `Génère une description produit optimisée pour : ${prompt}`
        }
      ]
    });

    const texte = completion.choices[0].message.content;

    res.json({ result: texte });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "Erreur OpenAI" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});