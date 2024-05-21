const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3003;

// Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const image = await Jimp.read(req.file.buffer);
   

    // Resize the images
    const phoneProfileImage = image.clone().resize(100, 100);
    const normalSizeImage = image.clone().resize(800, 600);
    const laptopSizeImage = image.clone().resize(1920, 1080);

    // Define file paths
    const phoneProfilePath = path.join(__dirname, 'uploads', 'phone-profile.png');
    const normalSizePath = path.join(__dirname, 'uploads', 'normal-size.png');
    const laptopSizePath = path.join(__dirname, 'uploads', 'laptop-size.png');

    // Ensure the uploads directory exists
    if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
      fs.mkdirSync(path.join(__dirname, 'uploads'));
    }

    // Save the resized images
    await phoneProfileImage.writeAsync(phoneProfilePath);
    await normalSizeImage.writeAsync(normalSizePath);
    await laptopSizeImage.writeAsync(laptopSizePath);

    res.status(200).send({
      message: 'Images resized successfully',
      images: {
        phoneProfile: phoneProfilePath,
        normalSize: normalSizePath,
        laptopSize: laptopSizePath,
      },
    });
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).send('Error processing images.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
