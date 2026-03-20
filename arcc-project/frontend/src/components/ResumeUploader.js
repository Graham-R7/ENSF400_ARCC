import React, { useState } from "react";
import { uploadResume } from "../services/api";
import { useWorkflow } from "../context/WorkflowContext";
import { validateResumeFile } from "../utils/validation";
import Button from "./Button";
import Card from "./Card";

export default function ResumeUploader() {
  const { setResumeUploadResult } = useWorkflow();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setError("");
      return;
    }

    const validationError = validateResumeFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setMessage("");
      return;
    }

    setError("");
    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    const validationError = validateResumeFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setUploadProgress(8);
    setError("");
    setMessage("");

    const progressTimer = setInterval(() => {
      setUploadProgress((currentProgress) => (currentProgress >= 90 ? currentProgress : currentProgress + 12));
    }, 180);

    try {
      const result = await uploadResume(file);
      setUploadProgress(100);
      setResumeUploadResult({
        fileName: file.name,
        parsedData: result?.data,
      });
      setMessage("Resume uploaded successfully!");
      console.log(result);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      clearInterval(progressTimer);
      setUploading(false);
    }
  };

  return (
    <Card className="feature-card">
      <h2>Upload Resume</h2>
      <p className="page-intro">Supported formats: PDF and DOCX, up to 5MB.</p>
      <label className="file-input" htmlFor="resume-file">
        <span id="resume-file-help">Choose file</span>
        <input
          id="resume-file"
          name="resume"
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          disabled={uploading}
          aria-describedby="resume-file-help resume-upload-status"
        />
      </label>
      {uploading ? (
        <div className="upload-progress-wrap" aria-live="polite">
          <div
            className="upload-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={uploadProgress}
          >
            <div className="upload-progress__bar" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="status-text status-text--info">{uploadProgress}% uploaded</p>
        </div>
      ) : null}
      {file && <p className="status-text">Selected: {file.name}</p>}
      <div id="resume-upload-status" aria-live="polite">
        {error && <p className="status-text status-text--error">{error}</p>}
        {message && <p className="status-text status-text--success">{message}</p>}
      </div>
      <Button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {message ? (
        <a className="btn btn--outline btn--as-link" href="/job">
          Continue to Job Description
        </a>
      ) : null}
    </Card>
  );
}
