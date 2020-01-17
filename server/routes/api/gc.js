const express = require('express');

const router = express.Router();

// GET Geocase
router.get('/', (req, res) => {
  res.send('GET GeoCASe')
});

module.exports = router;
