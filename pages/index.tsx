// pages/index.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

const FileUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [fileName, setFileName]= useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
          setFile(event.target.files[0]);
      }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };

      reader.onerror = (e) => {
        reject(e);
      };

      reader.readAsText(file);
    });
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const fileContent = await readFileContent(file);

      if (!file) {
          console.error('No file selected.');
          return;
      }

      console.log('name: ', file.name)
      console.log('text:', fileContent)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({'name': file.name, 'text': fileContent}),
        })
        const result = await response.json()
        setDownloadLink(result.downloadLink);
        setFileName(result.fileName);
      } catch (error) {
          console.error('Error uploading file:', error);
      }
  };

  const handleDownload = async () => {
    if (downloadLink) {
      try {
        console.log(downloadLink)
        const response = await fetch(downloadLink);
        const blob = await response.blob();
  
        // Create a Blob URL for the file
        const url = window.URL.createObjectURL(blob);
  
        // Create an anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName + '.yaml';
  
        // Append the anchor to the document body and trigger the click event
        document.body.appendChild(a);
        a.click();
  
        // Remove the anchor and revoke the Blob URL
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading YAML:', error);
      }
    }
  };

  return (
      <div>
          <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleFileChange} accept=".txt" required />
              <button type="submit">Upload</button>
          </form>

          {downloadLink && (
              <button onClick={handleDownload}>Download YAML</button>
          )}
      </div>
  );
};

const Home: React.FC = () => {
  return (
    <div>
      <FileUploadForm />
    </div>
  );
};

export default Home;