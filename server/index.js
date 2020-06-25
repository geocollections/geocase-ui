require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const gc = require('./routes/api/gc');
const api = require('./routes/api');
const apiMock = require('./routes/api/mock');

app.use('/api/gc', gc);

// Handle production
if (process.env.NODE_ENV === 'production') {
  app.use('/api', api);

  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
} else {
  app.use('/api', apiMock);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
