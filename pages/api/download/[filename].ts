import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
const fs = require('fs');

export default async function download(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { filename } = req.query;

    if (!filename) {
      res.status(400).send('Filename not provided.');
      return;
    }

    const filePath = path.join(
      '/Users/jess/Projects/terminal-themes-converter/generated', filename
    );

    // Read the file content as a Buffer
    const fileContent = await fs.readFile(filePath);

    // Set the response headers for file download
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/yaml');

    // Send the file content as the response
    res.send(fileContent);
  } catch (error) {
    console.error('Error processing download:', error);
    res.status(500).send('Error processing download.');
  }
}