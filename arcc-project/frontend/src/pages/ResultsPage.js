import React from "react";
import Card from "../components/Card";

const ResultsPage = () => {
  return (
    <div className="page">
      <p className="eyebrow">Step 3</p>
      <h1>Analysis Results</h1>
      <div className="info-grid">
        <Card className="info-card">
          <h2>Skill Gaps</h2>
          <p>Spot what the posting asks for that your current resume does not emphasize yet.</p>
        </Card>
        <Card className="info-card">
          <h2>Stronger Bullets</h2>
          <p>Rewrite project and experience lines with clearer outcomes and relevance.</p>
        </Card>
        <Card className="info-card">
          <h2>Match Signals</h2>
          <p>See where your profile already aligns well so you can lean into strengths.</p>
        </Card>
      </div>
      <Card className="feature-card">
        <h2>Resume Analysis</h2>
        <p>Skill gaps, suggestions, and matching results will be displayed here.</p>
      </Card>
    </div>
  );
};

export default ResultsPage;
