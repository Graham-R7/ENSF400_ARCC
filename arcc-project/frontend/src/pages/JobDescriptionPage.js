import React, { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

const JobDescriptionPage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    // TODO: Submit to backend
    console.log({ jobTitle, description });
  };

  return (
    <div className="page">
      <p className="eyebrow">Step 2</p>
      <h1>Job Description</h1>
      <Card className="feature-card">
        <h2>Enter Job Details</h2>
        <p className="page-intro">
          Paste the role title and description so ARCC can tailor resume feedback to the job.
        </p>
        <Input
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="10"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Card>
    </div>
  );
};

export default JobDescriptionPage;
