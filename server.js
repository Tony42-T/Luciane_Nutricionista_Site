// server.js

// 1. Importar dependências
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

// 2. Inicializar o app
const app = express();

// 3. Configurar porta
const PORT = process.env.PORT || 3000;

// ✅ 4. Configurar CORS (DEVE vir antes das rotas)
app.use(cors({
  origin: [
    'https://luciane-nutricionista-site-api.onrender.com', // domínio do Render
    'http://localhost:3000'       // útil para testar localmente
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// ✅ 5. Middleware para ler formulários
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ 6. Tornar a pasta 'docs' acessível
app.use(express.static(path.join(__dirname, 'docs')));

// ✅ 7. Inicializar o Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ 8. Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// ✅ 9. Rota para processar formulário
app.post('/send-email', async (req, res) => {
  const { nome, email, phone, mensagem } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.EMAIL_TO,
      subject: `Novo contato de ${nome}`,
      text: `
        Nome: ${nome}
        Email: ${email}
        Telefone: ${phone}
        Mensagem:
        ${mensagem}
      `
    });

    console.log('✅ Email enviado com sucesso:', data);
    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao enviar o email:', error);
    res.status(500).json({ success: false, message: 'Ocorreu um erro ao enviar o email.' });
  }
});

// ✅ 10. Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
