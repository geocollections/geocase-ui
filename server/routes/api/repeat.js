const express = require('express');

const router = express.Router();

const axios = require('axios')

router.get('/', async (req, res) => {
  if (req.query) {
    if (req.query.url) {
      try {
        let response = await axios.get(req.query.url)
        if (response) {
          if (response.status === 200) {
            // Todo: XML to JSON
            if (response.data) res.send({ data: response.data })
            else res.send({
              error: "No data from response!",
              status: response.status,
              statusText: response.statusText
            })
          } else res.send({
            error: "Request failed!",
            status: response.status,
            statusText: response.statusText
          })
        } else res.send({ error: "Request failed!" })

        console.log(response)
        res.send({response: response.status, url: req.query.url})
      } catch (err) {
        res.status(500).send({ error: err.code })
      }
    } else res.status(500).send({ error: "Missing query parameter: url" })
  } else res.status(500).send({ error: "Check your URL!" })

});

module.exports = router;
