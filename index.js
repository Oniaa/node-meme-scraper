/* eslint-disable no-unused-expressions */
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { get } from 'node:https';
import cheerio from 'cheerio';

const websiteUrl = 'https://memegen-link-examples-upleveled.netlify.app/';
const imagesUrls = [];

const createFolder = async function () {
  try {
    await mkdir('./memes');
  } catch (e) {
    console.error(e);
  }
};

const imageDownload = async function (url, path) {
  const imageFile = createWriteStream(path);
  const response = await new Promise((resolve, reject) => {
    get(url, resolve).on('error', reject);
  });
  response.pipe(imageFile);
  console.log('Image downloaded: ' + path);
};

get(websiteUrl, function (response) {
  let data = '';
  response.on('data', function (chunk) {
    data += chunk;
  });

  response.on('end', function () {
    const $ = cheerio.load(data);
    $('section img').each(async function (i, el) {
      if (i < 10) {
        const imageUrl = $(el).attr('src');
        imagesUrls.push(imageUrl);
        const name = `${(i + 1).toString().padStart(2, '0')}.jpg`;
        await imageDownload(imageUrl, `./memes/${name}`);
      }
    });
  });
});
