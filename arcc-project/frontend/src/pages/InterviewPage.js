import React from "react";
import Card from "../components/Card";

const InterviewPage = () => {
  return (
    <div className="page">
      <p className="eyebrow">Step 4</p>
      <h1>Interview Practice</h1>
      <div className="info-grid">
        <Card className="info-card">
          <h2>Behavioral Prep</h2>
          <p>Practice structured stories about teamwork, problem-solving, and ownership.</p>
        </Card>
        <Card className="info-card">
          <h2>Role Questions</h2>
          <p>Focus on prompts that connect directly to the job description you entered.</p>
        </Card>
      </div>
      <Card className="feature-card">
        <h2>AI-Powered Interview Chat</h2>
        <p>Practice your interview skills with AI assistance.</p>
      </Card>
    </div>
  );
};

export default InterviewPage;
