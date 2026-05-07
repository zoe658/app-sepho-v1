module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ result: "Méthode non autorisée" });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ result: "Aucun prompt reçu" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en copywriting e-commerce."
          },
          {
            role: "user",
            content: `Fais une description eBay optimisée pour : ${prompt}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur OpenAI :", data);
      return res.status(500).json({
        result: "Erreur OpenAI : " + (data.error?.message || "inconnue")
      });
    }

    const texte = data.choices[0].message.content;

    return res.status(200).json({ result: texte });

  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ result: "Erreur serveur côté Vercel" });
  }
};