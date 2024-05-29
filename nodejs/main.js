const fs = require('fs');
const im = require('imagemagick');

const inputPath = 'C:/Users/harsh/Documents/GitHub/image-Upload/nodejs/uploads/laptop-size.pgn'; // Change this to your input image path
const outputPath = 'C:/Users/harsh/Documents/GitHub/image-Upload/nodejs/results/laptop-size.pgn';

// Compression options
const options = {
  srcPath: inputPath,
  dstPath: outputPath,
  quality: 0.7 // Set quality between 0 and 1 (1 being the best quality)
};

// Compress the image
im.convert([options.srcPath, '-quality', options.quality * 100, options.dstPath], function(err, stdout) {
  if (err) throw err;
  console.log('Image compression complete');
});
