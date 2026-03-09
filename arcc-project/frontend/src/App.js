import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UploadResumePage from "./pages/UploadResumePage";
import JobDescriptionPage from "./pages/JobDescriptionPage";
import ResultsPage from "./pages/ResultsPage";
import InterviewPage from "./pages/InterviewPage";
import DashboardPage from "./pages/DashboardPage";
import Layout from "./components/Layout";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadResumePage />} />
          <Route path="/job" element={<JobDescriptionPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
