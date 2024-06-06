const express = require('express');
const multer = require('multer');
const gm = require('gm').subClass({ imageMagick: true });
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3003;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    console.log("Image upload initiated...");
    console.log(req.body.requiredImage);
    const outputDir = path.join(__dirname, 'resized');
    const outputFileName = path.parse(req.file.originalname).name;

    if (!fs.existsSync(outputDir)) {
      console.log("Creating 'resized' directory...");
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const resizeImage = (buffer, width, height) => {
      return new Promise((resolve, reject) => {
        gm(buffer)
          .resize(width, height)
          .toBuffer('PNG', (err, buffer) => {
            if (err) {
              return reject(err);
            }
            resolve(buffer);
          });
      });
    };

    const phoneProfileBuffer = await resizeImage(req.file.buffer, 100, 100);
    const normalSizeBuffer = await resizeImage(req.file.buffer, 800, 600);
    const laptopSizeBuffer = await resizeImage(req.file.buffer, 1920, 1080);

    const phoneProfilePath = path.join(outputDir, `phone-profile-${outputFileName}.png`);
    const normalSizePath = path.join(outputDir, `normal-size-${outputFileName}.png`);
    const laptopSizePath = path.join(outputDir, `laptop-size-${outputFileName}.png`);

    // Save the buffers to files
    fs.writeFileSync(phoneProfilePath, phoneProfileBuffer);
    fs.writeFileSync(normalSizePath, normalSizeBuffer);
    fs.writeFileSync(laptopSizePath, laptopSizeBuffer);

    // Set the appropriate headers and send the image buffers
    let output=phoneProfileBuffer;
    if(req.body.requiredImage==="phone"){
      output=phoneProfileBuffer
    }else if(req.body.requiredImage==="normal"){
      output=normalSizeBuffer
    }else if(req.body.requiredImage==="laptop"){
      output=laptopSizeBuffer
    }

    if(req.body.imageLinks===true){
      return res.status(200).send({
      message: 'Images resized successfully',
      images: {
        phoneProfile: phoneProfilePath,
        normalSize: normalSizePath,
        laptopSize: laptopSizePath,
      },
    });
  }
  else{
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `inline; filename="phone-profile-${outputFileName}.png"`);
    res.send(output);
  }
    

    console.log('Images resized successfully to fit different sizes');
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).send('Error processing images.');
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
