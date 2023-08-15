// Libs
import express from 'express';
import bodyParser from "body-parser";
import pug from 'pug';
import { JsonDB, Config } from 'node-json-db';
import dotenv from "dotenv";

// Config
const app = express();
const db = new JsonDB(new Config("db", true, true, '/'));
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
    await db.reload();
    const data = await db.getData('/urls');
    const urlDataIndex = data.findIndex((url) => url.shortUrl === `${process.env.APP_URL}/url/${code}`);

    if (urlDataIndex === -1) {
        return res.status(404).send('URL not found');
    }

    // Increment the clicks value
    data[urlDataIndex].clicks = data[urlDataIndex].clicks ? data[urlDataIndex].clicks + 1 : 1;
    await db.push(`/urls`, data); // Update the entire '/urls' array

    res.redirect(data[urlDataIndex].defaultUrl);
}