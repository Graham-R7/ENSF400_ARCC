import React, { useState } from "react";
import { uploadResume } from "../services/api";
import Button from "./Button";
import Card from "./Card";

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a PDF or DOCX file.";
    }
    if (file.size > maxSize) {
      return "File size must be less than 5MB.";
    }
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
        setMessage("");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const result = await uploadResume(file);
      setMessage("Resume uploaded successfully!");
      console.log(result);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="feature-card">
      <h2>Upload Resume</h2>
      <p className="page-intro">Supported formats: PDF and DOCX, up to 5MB.</p>
      <label className="file-input">
        <span>Choose file</span>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {file && <p className="status-text">Selected: {file.name}</p>}
      {error && <p className="status-text status-text--error">{error}</p>}
      {message && <p className="status-text status-text--success">{message}</p>}
      <Button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </Card>
  );
}
