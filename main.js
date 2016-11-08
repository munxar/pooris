const express = require('express');
var cookieParser = require('cookie-parser');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const convert = require('./convert');

const config = {
    SIROOP_HOST:  'https://www.siroop.ch',
    BALDER_HOST: 'http://127.0.0.1:8000',
    CONCRETE_PATH: '/products/catalogproduct/'
};

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use((req, res) => {
    // create cookie jar and copy cockies from original request
    var j = request.jar();
    Object.keys(req.cookies).forEach(function(key) {
        let cookie = request.cookie(key + "=" + req.cookies[key]);
        j.setCookie(cookie, config.SIROOP_HOST);
    });

    request(req.path, {
        baseUrl: config.SIROOP_HOST,
        method: req.method,
        qs: req.query,
        encoding: null,
        jar: j
        }, (err, response, body) => {
        if(err) {
            console.error(err);
        }
        res.set(response.headers);
        let type = response.headers['content-type'];
        if(response.statusCode != 200) {
            console.error(response.statusCode, req.path);
        }
        if(/text\/html/.test(type)) {
            res.send(convert(body));
        } else {
            res.send(body);
        }
    })
});

app.listen(3000);