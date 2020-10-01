const express = require('express');

const router = express.Router();

const axios = require('axios')
const xml2js = require('xml2js');

router.get('/', async (req, res) => {
  if (req.query) {
    if (req.query.url) {
      try {
        let response = await axios.get(req.query.url)
        if (response) {
          if (response.status === 200) {
            if (response.data) {
              let json = response.data;
              if (response.data.startsWith("<abcd:DataSets xmlns:xsi=")) {
                json = await xml2js.parseStringPromise(response.data, { mergeAttrs: true });
              }
              res.send({ data: json })
            }
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
        res.send({response: response.status, url: req.query.url})
      } catch (err) {
        res.status(500).send({ error: err.code })
      }
    } else res.status(500).send({ error: "Missing query parameter: url" })
  } else res.status(500).send({ error: "Check your URL!" })
});

module.exports = router;
