const express = require('express');

const router = express.Router();

// GET Geocase
router.get('/', (req, res) => {
  res.send('GET Geocase')
});

module.exports = router;
