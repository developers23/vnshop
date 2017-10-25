'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/env');
var jwt = require('jsonwebtoken');
// var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var Users = require('../../modules/users');

/** 
 * 验证token
 */
function authToken(credentialsRequired) {
    return compose()
        .use(function(req, res, next) {
            if (req.query && req.query.access_token) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }
            next();
        })
        .use(expressJwt({
            secret: config.session.secrets,
            credentialsRequired: credentialsRequired //是否抛出错误
        }))
}
/**
 * 验证用户是否登录
 */
function isAuthenticated() {
    return compose()
        .use(authToken(true))
        .use(function(err, req, res, next) {
            //expressJwt 错误处理中间件
            if (err.name === 'UnauthorizedError') {
                return res.json({ status: 300, msg: '用户未登录', result: "" })
            }
            next();
        })
        .use(function(req, res, next) {
            Users.findById(req.user._id, function(err, user) {
                if (err) return res.status(500).send();
                if (!user) return res.status(401).send();
                req.user = user;
                next();
            });
        });
}

/**
 * 生成token
 */
function signToken(id) {
    return jwt.sign({ _id: id }, config.session.secrets, { expiresIn: '1y' });
}





exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;