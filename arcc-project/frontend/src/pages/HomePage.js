import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import ARCCLogo from "../components/ARCCLogo";

const HomePage = () => {
  return (
    <div>
      <div className="hero-brand">
        <ARCCLogo size={72} showWordmark={false} />
        <div>
          <h1>Welcome to ARCC</h1>
          <p className="hero-brand__caption">Smart tools for resumes, roles, results, and readiness.</p>
        </div>
      </div>
      <Card>
        <h2>AI Resume and Career Coach</h2>
        <p>
          Get personalized career advice with AI-powered resume analysis and
          interview preparation.
        </p>
        <Button>Get Started</Button>
      </Card>
    </div>
  );
};

export default HomePage;
