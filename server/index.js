require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const proxy = require('http-proxy-middleware');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const gc = require('./routes/api/gc');

app.use('/api/gc', gc);

const apiProxy = proxy({
  target: process.env.API_URL,
  pathRewrite: { '^/api': '' },
  auth: `${process.env.API_USER}:${process.env.API_PASS}`,
  changeOrigin: true
});

app.use('/api', apiProxy);

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
