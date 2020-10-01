require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); // Todo: Can be removed, express v4.16.0 onwards has this functionality built-in
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const gc = require('./routes/api/gc');
const api = require('./routes/api');
const apiMock = require('./routes/api/mock');
const apiRepeat = require('./routes/api/repeat');

app.use('/api/gc', gc);
app.use('/api/repeat', apiRepeat);

// Handle production
if (process.env.NODE_ENV === 'production') {
  app.use('/api', api);

  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
} else {
  if (process.env.USE_MOCK_DATA) app.use('/api', apiMock);
  else app.use('/api', api);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
