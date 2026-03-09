import React, { useState } from "react";
import { uploadResume } from "../services/api";

export default function ResumeUploader() {

  const [file, setFile] = useState(null);

  const handleUpload = async () => {

    const result = await uploadResume(file);

    console.log(result);
  };

  return (
    <div>
      <h2>Upload Resume</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}