const fs = require('fs');
const AWS = require('aws-sdk');
const archiver = require('archiver');
var nodemailer = require('nodemailer');

// Enter copied or downloaded access ID and secret key here
const ID = '';
const SECRET = '';

// The name of the bucket that you have created
const BUCKET_NAME = 'apim-3.2.0-ui-testing';
var secretAccessKey = process.env.S3_SECRET_KEY;
var accessKeyId = process.env.S3_ACCESS_KEY;
var testGridEmailPWD = process.env.TESTGRID_EMAIL_PASSWORD;


const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

var timestamp = new Date() / 1000;

const uploadFile = (fileName, destination, contentType) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);
  // Setting up S3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: destination, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read',
      ContentType : contentType
  };
  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          // throw err;
          console.log(`File uploaded Error to AWS s3 bucket.`);
      }
      console.log(`File uploaded successfully. ${data.Location}`);   
  });
};

const sendMail = () => {
  var mochawesomeUploadLocation = `https://s3.us-east-2.amazonaws.com/apim-3.2.0-ui-testing/410-result/mochawesome-bundle-${timestamp}.html `
  var screenshotUploadLocation = `https://s3.us-east-2.amazonaws.com/apim-3.2.0-ui-testing/410-result/screenshots-${timestamp}.zip `
  var content = `Click on ${mochawesomeUploadLocation} to view the complete test report. Screenshots available in ${screenshotUploadLocation}`;
  var transporter = nodemailer.createTransport({
    host: 'tygra.wso2.com',
    port: '2587',
    auth: {
      user: 'testgrid',
      pass: testGridEmailPWD
    }
  });

  var mailOptions = {
    from: "TestGrid Team <testgrid@wso2.com>",
    to: "prasanna@wso2.com,vimukthi@wso2.com,rosens@wso2.com,nandika@wso2.com,dhanushka@wso2.com,bathiya@wso2.com",
    subject: `WSO2 APIM 4.1.0 UI TESTS`,
    html: content
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

uploadFile('./cypress/reports/html/mochawesome-bundle.html', `410-result/mochawesome-bundle-${timestamp}.html`, "text/html");
var zipFileOutputLocation = `./cypress/screenshots-${timestamp}.zip`;
zipDirectory('./cypress/screenshots', zipFileOutputLocation).then(()=>{
  uploadFile(zipFileOutputLocation, `410-result/screenshots-${timestamp}.zip`, "application/zip")
});
sendMail();
