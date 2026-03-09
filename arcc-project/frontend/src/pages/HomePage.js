import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to ARCC</h1>
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
