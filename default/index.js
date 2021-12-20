const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    console.log(req.url)
    res.sendFile(`${__dirname}/index.html`);
});

module.exports = router;