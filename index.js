import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { get } from 'node:https';
import cheerio from 'cheerio';

async function imageDownload(url, path) {
  const file = createWriteStream(path);
  const response = await new Promise((resolve, reject) => {
    get(url, resolve).on('error', reject);
  });
  response.pipe(file);
  console.log('Image downloaded: ' + path);
}

imageDownload(
  'https://api.memegen.link/images/bad/your_meme_is_bad/and_you_should_feel_bad.jpg?width=300',
  './memes/01.jpg',
);
