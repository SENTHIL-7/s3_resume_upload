const express = require('express');
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

app.get('/get-signed-url', async (req, res) => {
  const { fileName, fileType } = req.query;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    ACL: 'public-read'
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    res.json({ url });
  } catch (err) {
    console.error('Error generating signed URL', err);
    res.status(500).json({ error: 'Error generating URL' });
  }
});
app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});