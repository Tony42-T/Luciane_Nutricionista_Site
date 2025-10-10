// server.js

// 1. Importar dependências
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Resend } = require('resend');  // importamos o Resend
require('dotenv').config(); // para usar variáveis de ambiente (como a chave da API)

// 2. Inicializar o app
const app = express();

// 3. Configurar porta
const PORT = process.env.PORT || 3000;

// 4. Middleware para ler formulários
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 5. Tornar a pasta 'docs' acessível
app.use(express.static(path.join(__dirname, 'docs')));

// 6. Inicializar o Resend (✅ NOVO)
const resend = new Resend(process.env.RESEND_API_KEY);

// 7. Rota principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// 8. Rota para processar formulário
app.post('https://luciane-site.onrender.com/send-email', async (req, res) => {
  const { nome, email, phone, mensagem } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // remetente autorizado pela Resend
      to: process.env.EMAIL_TO, // o destino vem do .env
      subject: `Novo contato de ${nome}`,
      text: `
        Nome: ${nome}
        Email: ${email}
        phone: ${phone}
        Mensagem:
        ${mensagem}
      `
    });

    console.log('✅ Email enviado com sucesso:', data);
    res.status(200).send('Mensagem enviada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao enviar o email:', error);
    res.status(500).send('Ocorreu um erro ao enviar o email.');
  }
});



// 9. Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
