const express = require('express');
const router = express.Router();

router.get('/index', (req, res) => {
    res.set('Cache-control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.render('pages/index', { time: Date.now() });
});

module.exports = router;