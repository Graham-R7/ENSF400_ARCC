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
    <div>
      <h1>Job Description</h1>
      <Card>
        <h2>Enter Job Details</h2>
        <Input
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="10"
          style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Card>
    </div>
  );
};

export default JobDescriptionPage;
