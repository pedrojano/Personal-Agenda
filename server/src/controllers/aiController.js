const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateSchedule = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "O prompt é obrigatório." });
  }

  try {
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = `
  Você é um assistente que cria cronogramas diários detalhados com base em prompts fornecidos pelos usuários.
  
  Pedido do usuário: "${prompt}"
  
  Responda de forma clara e organizada, listando as atividades do dia com horários específicos,
  Não use markdown complexo (como **negrito**), use texto limpo.
  `;

    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    res.json({
      message: "Sucesso!",
      result: text,
    });
  } catch (error) {
    console.log("Erro Detalhado da IA:", error);
    res.status(500).json({
      error: "Erro ao gerar o cronograma.",
      details: error.message,
    });
  }
};
