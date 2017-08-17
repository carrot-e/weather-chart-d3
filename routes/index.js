const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    const options = {formatMatcher: 'basic', month: 'long', day: 'numeric'};
    let from = new Date();
    let to = new Date();
    to.setDate(to.getDate() + 10);

    res.render('index', {
        title: 'Weather Chart',
        from: from.toLocaleString('en-US', options),
        to: to.toLocaleString('en-US', options)
    });
});

module.exports = router;
