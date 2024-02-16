// Libs
import { JsonDB, Config } from 'node-json-db';
import dotenv from 'dotenv';
import qrcode from 'qrcode';

// Config
const db = new JsonDB(new Config("db", true, true, '/'));
dotenv.config();

export async function createShortUrl(defaultUrl) {
    const data = await db.getData('/urls');
    const url = {
        id: data.length + 1,
        defaultUrl: defaultUrl,
        shortUrl: `${process.env.APP_URL}/url/${await randomCode()}`,
        clicks: 0,
    };
    await db.reload();
    await db.push('/urls[]', url, true).catch((err) => {
        console.log(err);
    });
    await db.reload();
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
        await randomCode();
    } else {
        return result;
    }
}

export async function createQRCode(url) {
    let link = url ? url+"?qr" : null
    try {
        const qr = await qrcode.toDataURL( link, { errorCorrectionLevel: 'H', type: '' });
        return qr;
    } catch(e) {
        console.log(e)
    }
}