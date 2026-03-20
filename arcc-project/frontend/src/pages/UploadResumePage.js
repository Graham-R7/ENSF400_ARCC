import React from "react";
import ResumeUploader from "../components/ResumeUploader";

const UploadResumePage = () => {
  return (
    <div className="page">
      <p className="eyebrow">Step 1</p>
      <h1>Upload Your Resume</h1>
      <p className="page-intro">Upload your resume in PDF or DOCX format for analysis and tailored feedback.</p>
      <ResumeUploader />
    </div>
  );
};

export default UploadResumePage;
