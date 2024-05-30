const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/uploadimages', upload.single('image2'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    console.log("Image upload initiated...");

    const imagePath = req.file.path;
    const outputDir = path.join(__dirname, 'resized');
    const outputFileName = req.file.originalname; 
    const outputPath = path.join(outputDir, outputFileName);

    console.log(`Original image path: ${imagePath}`);
    console.log(`Output image path: ${outputPath}`);
    if (!fs.existsSync(outputDir)) {
      console.log("Creating 'resized' directory...");
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Resize the image using sharp and get the buffer
    const resizedImageBuffer = await sharp(imagePath)
      .resize(100, 60) // Adjust the width and height as needed
      .toBuffer();

    // Save the buffer to a file (if you still want to save it)
    await sharp(resizedImageBuffer).toFile(outputPath);

    // Set the appropriate headers and send the image buffer
    res.set('Content-Type', req.file.mimetype);
    res.set('Content-Disposition', `inline; filename="${outputFileName}"`);
    res.send(resizedImageBuffer);

    console.log('Image resized successfully to fit within 100x60px');
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).send('Error processing images.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
