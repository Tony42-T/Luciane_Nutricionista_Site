// server.js

// 1. Importar dependências
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config(); // para usar variáveis de ambiente (senha do email)

// 2. Inicializar o app
const app = express();

// 3. Configurar porta
const PORT = process.env.PORT || 3000;

// 4. Middleware para ler formulários
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 5. Tornar a pasta 'public' acessível
app.use(express.static(path.join(__dirname, 'public')));

// 6. Rota principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 7. Rota para processar formulário
app.post('/send-email', async (req, res) => {
  const { nome, email, mensagem } = req.body;

  // Configuração do transporte (usando Gmail)
  const transporter = nodemailer.createTransport({
  host: "smtp.seudominio.com", 
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Novo contato de ${nome}`,
    text: `
      Nome: ${nome}
      Email: ${email}
      Mensagem:
      ${mensagem}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Mensagem enviada com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o email:', error);
    res.status(500).send('Ocorreu um erro ao enviar o email.');
  }
});

// 8. Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
