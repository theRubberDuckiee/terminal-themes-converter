import { NextApiRequest, NextApiResponse } from 'next';
const path = require('path');
import fs from 'fs';
const { exec } = require('child_process');
import * as xml2js from 'xml2js';
const yaml = require('js-yaml');

function convertRGBToHex(rgbArray: number[]): string {
  // Convert float values to integers
  const rgbIntegers = rgbArray.map(component => Math.round(component * 255));

  // Convert integers to hex format
  const hexString = rgbIntegers
      .map(component =>
        Number(component).toString(16).padStart(2, '0'))
        .join('');

  return `#${hexString}`;
}
 
export default async function upload(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = JSON.parse(req.body)
  try {
    if (!req.body) {
        return res.status(400).send('No file uploaded.');
    }
    const fileNameWithExtension = body.name;
    const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
    const fileNameWithoutExtension = fileNameWithExtension.substring(0, lastDotIndex);

    const newText = {
      accent: '',
      details: 'darker',
      foreground: '',
      background: '',
      terminal_colors: {
          bright: {
            black: '',
            blue: '',
            cyan: '',
            green: '',
            magenta: '',
            red: '',
            white: '',
            yellow: '',
          },
          normal: {
            black: '',
            blue: '',
            cyan: '',
            green: '',
            magenta: '',
            red: '',
            white: '',
            yellow: '',

          }
          }
      }
    const xmlString = body.text

    xml2js.parseString(xmlString, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
      } else {
        const ka = result.plist.dict[0].key
        const bla = result.plist.dict[0].dict

        for (let j=0; j<ka.length; j++) {
          const obj = bla[j]
          const keys = obj.key
          const index = keys.indexOf('Color Space');

          // If found, remove it using splice
          if (index !== -1) {
            keys.splice(index, 1);
          }

          const reals = obj.real
          const ansi = ka[j]
          let blue = 0
          let green = 0
          let red = 0
          for (let i = 0; i < keys.length; i++) {
            const cha = keys[i]
            if (cha == 'Red Component') {
              red = Number(reals[i])
            }
            if (cha == 'Blue Component') {
              blue = Number(reals[i])
            }
            if (cha == 'Green Component') {
              green = Number(reals[i])
            }
          }
            if (ansi == "Ansi 0 Color"){
              newText.terminal_colors.normal.black = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 1 Color") {
              newText.terminal_colors.normal.red = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 10 Color") {
              newText.terminal_colors.bright.green = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 11 Color") {
              newText.terminal_colors.bright.yellow = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 12 Color") {
              newText.terminal_colors.bright.blue = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 13 Color") {
              newText.terminal_colors.bright.magenta = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 14 Color") {
              newText.terminal_colors.bright.cyan = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 15 Color") {

              newText.terminal_colors.bright.white = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 2 Color") {
              newText.terminal_colors.normal.green = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 3 Color"){
              newText.terminal_colors.normal.yellow = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 4 Color"){
              newText.terminal_colors.normal.blue = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 5 Color"){
              newText.terminal_colors.normal.magenta = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 6 Color"){
              newText.terminal_colors.normal.cyan = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 7 Color"){
              newText.terminal_colors.normal.white = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 8 Color"){
              newText.terminal_colors.bright.black = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Ansi 9 Color"){
              newText.terminal_colors.bright.red = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Background Color"){
              newText.background = convertRGBToHex([red, green, blue])
            }
            if (ansi == "Foreground Color"){
              newText.foreground = convertRGBToHex([red, green, blue])
            }
            newText.accent = newText.foreground
      }
      console.log(newText)
      }
    });

    const yamlString = yaml.dump(newText);
    console.log('dumped')
    

        const generatedFileName = fileNameWithoutExtension + '.yaml';
        const yamlFilePath = path.join(process.cwd(), '/generated', generatedFileName);
        console.log('yamlFilePath: ', yamlFilePath)
        require('fs').writeFileSync(yamlFilePath, body.text);
        console.log('wrote file')

        // Send the download link as the response
        const downloadLink = `/api/download/${generatedFileName}`;

        // Optionally, clean up: Delete the temporary uploaded and generated files
        // fs.unlinkSync(filePath);
        // fs.unlinkSync(yamlFilePath);
        res.status(200).send({
          downloadLink: downloadLink,
          filename: fileNameWithoutExtension,
      });
  } catch (error) {
      res.status(500).send('Error processing upload.');
  }
}

