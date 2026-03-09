import React from "react";
import ResumeUploader from "../components/ResumeUploader";

const UploadResumePage = () => {
  return (
    <div>
      <h1>Upload Your Resume</h1>
      <p>Upload your resume in PDF or DOCX format for analysis.</p>
      <ResumeUploader />
    </div>
  );
};

export default UploadResumePage;
