const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => res.send('Mestre Pokémon API Online!'));

app.post('/analisar', async (req, res) => {
  const { imageBase64 } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Você é o Mestre Pokémon. Explique de forma simples para uma criança como esta carta de Pokémon TCG funciona.";
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
    ]);
    res.json({ explicacao: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao consultar o Mestre" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando na porta ' + PORT));
