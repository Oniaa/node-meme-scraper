import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { get } from 'node:https';
import cheerio from 'cheerio';

const websiteUrl = 'https://memegen-link-examples-upleveled.netlify.app/';
const imagesUrls = [];

// Creates a memes folder if it doesnt exist otherwise it ignores it (important for replit since ./memes is in .gitignore)
const createFolder = async function () {
  try {
    await mkdir('./memes');
  } catch (e) {
    console.error(e);
  }
};

// Downloads images using its url and saves it in designated path
const imageDownload = async function (url, path) {
  const imageFile = createWriteStream(path);
  const response = await new Promise((resolve, reject) => {
    get(url, resolve).on('error', reject);
  });
  response.pipe(imageFile);
  console.log('Image downloaded: ' + path);
};

// Gets data from the Website
get(websiteUrl, function (response) {
  let data = '';
  response.on('data', function (chunk) {
    data += chunk;
  });

  // Uses cheerio to manage the data
  response.on('end', function () {
    const $ = cheerio.load(data);

    // Uses cheerio to search the section with the images
    // Each of the first 10 src of the images is then put trough a loop and pushed onto to an array
    // You probably dont need the array check later
    $('section img').each(async function (i, el) {
      if (i < 10) {
        const imageUrl = $(el).attr('src');
        imagesUrls.push(imageUrl);

        // Takes ever indicator (Image) staring with 1, makes it into a String
        // Uses padStart to always give 2 number starting with 0
        const name = `${(i + 1).toString().padStart(2, '0')}.jpg`;
        // Downloads the images and puts them in memes folder
        await imageDownload(imageUrl, `./memes/${name}`);
      }
    });
  });
});
