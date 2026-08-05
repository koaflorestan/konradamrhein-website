const fs = require('fs');
const path = require('path');

const slideshowDir = path.join(__dirname, 'images', 'slideshow');
const manifestPath = path.join(slideshowDir, 'manifest.json');
const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

function isImageFile(fileName) {
  return validExtensions.includes(path.extname(fileName).toLowerCase());
}

function buildManifest(files) {
  const images = files
    .filter(isImageFile)
    .filter((file) => file.toLowerCase() !== 'manifest.json')
    .sort()
    .map((file) => path.posix.join('images', 'slideshow', file));

  return {
    images,
  };
}

fs.readdir(slideshowDir, (err, files) => {
  if (err) {
    console.error(`Unable to read slideshow directory: ${slideshowDir}`);
    console.error(err.message);
    process.exit(1);
  }

  const manifest = buildManifest(files);
  const json = JSON.stringify(manifest, null, 2) + '\n';

  fs.writeFile(manifestPath, json, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error(`Unable to write manifest file: ${manifestPath}`);
      console.error(writeErr.message);
      process.exit(1);
    }

    console.log(`Updated slideshow manifest with ${manifest.images.length} image(s).`);
    manifest.images.forEach((image) => console.log(`  - ${image}`));
  });
});
