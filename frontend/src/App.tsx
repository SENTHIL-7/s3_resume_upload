import { useEffect, useState, type ChangeEvent } from 'react'
import './App.css'
import axios from "./api";
import axiosBase from "axios"; 
function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log(selectedFile);
      setFile(selectedFile);
      if (selectedFile) {
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const uploadFile = async () => {
    try{
         if (!file) return alert('Please select a file');

    const { data } = await axios.get('/get-signed-url', {
      params: {
        fileName: 'resume.pdf',
        fileType: file.type
      }
    });
    await axiosBase.put(data.url, file, {
      headers: {
        'Content-Type': file.type
      }
    });

    alert('File uploaded successfully');
    } 
    catch (error){
      console.error(error)
    }
 
  };
  return (
    <>
      <div>
        {preview && (
          file?.type.startsWith('image/') ? (
            <img src={preview} alt="Preview" width={200} />
          ) : (
            <embed src={preview} width="200" height="250" type="application/pdf" />
          )
        )}
        {!preview && <p>Upload a file</p>}
        <br />
        <input type="file" onChange={handleFileChange}  accept="application/pdf" />

        <button onClick={uploadFile} style={{ marginTop: '1rem' }}>Upload</button>
      </div >
    </>
  )
}

export default App
