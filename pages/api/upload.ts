import { NextApiRequest, NextApiResponse } from 'next';
const path = require('path');
import fs from 'fs';
const { exec } = require('child_process');
 
export default async function upload(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('can you see this?')
  const body = JSON.parse(req.body)
  try {
    if (!req.body) {
        return res.status(400).send('No file uploaded.');
    }
    const fileNameWithExtension = body.name;
    console.log('fileNameWithExtension: ', fileNameWithExtension)
    const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
    const fileNameWithoutExtension = fileNameWithExtension.substring(0, lastDotIndex);

    // Save the uploaded file temporarily
    const filePath = path.join(process.cwd(), '/uploads', fileNameWithoutExtension + '.txt');
    console.log('filePath: ', filePath)
    try {
      await fs.promises.writeFile(filePath, body.text);
      console.log('File written successfully.');
    } catch (error) {
      console.error('Error writing file:', error);
    }
    console.log("done")
    // Call your Python script with the uploaded file
    const pythonScript = path.join(process.cwd(), '/convert-iterm2-to-warp.py');
    console.log('pythonScript', pythonScript)
    exec(`python ${pythonScript} ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running Python script:', error);
            return res.status(500).send('Error running Python script.');
        }

        const generatedFileName = fileNameWithoutExtension + '.yaml';
        const yamlFilePath = path.join(process.cwd(), '/generated', generatedFileName);
        console.log('yamlfilepath:', yamlFilePath)

        // Send the download link as the response
        const downloadLink = `/api/download/${generatedFileName}`;

        // Optionally, clean up: Delete the temporary uploaded and generated files
        // fs.unlinkSync(filePath);
        // fs.unlinkSync(yamlFilePath);
        res.status(200).send({
          downloadLink: downloadLink,
          filename: fileNameWithoutExtension,
      });
    });
  } catch (error) {
      res.status(500).send('Error processing upload.');
  }
}

