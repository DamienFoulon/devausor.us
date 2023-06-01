// Libs
import express from 'express';
import bodyParser from "body-parser";
import pug from 'pug';
import { JsonDB, Config } from 'node-json-db';
import dotenv from "dotenv";

// Config
const app = express();
const db = new JsonDB(new Config("db", true, false, '/'));
dotenv.config();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Utils
import { createShortUrl } from '../utils/createUrl.js';
export async function getHome(req, res) {
    pug.renderFile('views/home.pug', {
        title: 'Home',
    },
    function(err, html) {
        if (err) throw err;
        res.send(html);
    });
}

export async function createUrl(req, res) {
    const defaultUrl = req.body.url;
    const url = await createShortUrl(defaultUrl);
    console.log('Created url : ', url)
    pug.renderFile('views/url.pug', {
        title: 'URL',
        url: url,
    },
    function(err, html) {
        if (err) throw err;
        res.send(html);
    });
}
export async function getUrl(req, res) {
    const code = req.params.url;
    const data = await db.getData('/urls');
    console.log('data : ', data);
    console.log('env url : ', process.env.APP_URL)
    console.log('expected url : ', `${process.env.APP_URL}/url/${code}`);
    const urlData = await data.find((url) => url.shortUrl == `${process.env.APP_URL}/url/${code}`);
    console.log('urlData : ', urlData);
    if (!urlData) {
        return res.status(404).send('URL not found');
    }
    res.redirect(urlData.defaultUrl);
}