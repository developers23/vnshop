"use strict"

var path = require('path');
module.exports = function(app) {
    app.use('/goods', require('./controller/goods'));
    // app.use('/auth', require('./auth'));
    app.use('/users', require('./controller/users'));

    // app.use('/*', function(req, res, next) {
    //     return res.json({ status: 'success', data: 'I will try my best to help you' });
    // })
}