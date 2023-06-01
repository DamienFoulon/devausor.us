// Libs
import { JsonDB, Config } from 'node-json-db';
import dotenv from 'dotenv';

// Config
const db = new JsonDB(new Config("db", true, false, '/'));
dotenv.config();

export async function createShortUrl(defaultUrl) {
    const data = await db.getData('/urls');
    const url = {
        id: data.length + 1,
        defaultUrl: defaultUrl,
        shortUrl: `${process.env.APP_URL}/url/${await randomCode()}`,
        clicks: 0,
    };
    await db.push('/urls[]', url, true).catch((err) => {
        console.log(err);
    });
    return url.shortUrl;
}

export async function randomCode() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    const data = await db.getData('/urls');
    const urlData = data.find((url) => url.shortUrl == `${process.env.APP_URL}/url/${result}`);
    if (urlData) {
        randomCode();
    } else {
        return result;
    }
}