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
    await sharp(imagePath)
      .resize(100, 60) 
      .toFile(outputPath);

    console.log('Image resized successfully to fit within 100x60px');
    res.send('Image uploaded and resized successfully.');
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).send('Error processing images.');
  }
});

// app.post('/upload', upload.single('image'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   try {
//     const image = await Jimp.read(req.file.buffer);
   

//     // Resize the images
//     const phoneProfileImage = image.clone().resize(100, 100);
//     const normalSizeImage = image.clone().resize(800, 600);
//     const laptopSizeImage = image.clone().resize(1920, 1080);

//     // Define file paths
//     const phoneProfilePath = path.join(__dirname, 'uploads', 'phone-profile.png');
//     const normalSizePath = path.join(__dirname, 'uploads', 'normal-size.png');
//     const laptopSizePath = path.join(__dirname, 'uploads', 'laptop-size.png');

//     // Ensure the uploads directory exists
//     if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
//       fs.mkdirSync(path.join(__dirname, 'uploads'));
//     }

//     // Save the resized images
//     await phoneProfileImage.writeAsync(phoneProfilePath);
//     await normalSizeImage.writeAsync(normalSizePath);
//     await laptopSizeImage.writeAsync(laptopSizePath);

//     res.status(200).send({
//       message: 'Images resized successfully',
//       images: {
//         phoneProfile: phoneProfilePath,
//         normalSize: normalSizePath,
//         laptopSize: laptopSizePath,
//       },
//     });
//   } catch (error) {
//     console.error('Error processing images:', error);
//     res.status(500).send('Error processing images.');
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
