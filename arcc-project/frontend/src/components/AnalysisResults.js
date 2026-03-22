import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { getAnalysis } from "../services/api";
import { useWorkflow } from "../context/WorkflowContext";

const AnalysisResults = () => {
  const { analysisId: paramId } = useParams();
  const { jobDetails } = useWorkflow();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const analysisId = paramId || jobDetails?.analysisId;

  useEffect(() => {
    if (!analysisId) {
      setError("No analysis ID provided.");
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const data = await getAnalysis(analysisId);
        setAnalysis(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch analysis results.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  if (loading) return <p>Loading analysis results...</p>;
  if (error) return <p className="status-text status-text--error">{error}</p>;
  if (!analysis) return <p>No analysis data available.</p>;

  return (
    <div className="page">
      <p className="eyebrow">Step 3</p>
      <h1>Analysis Results</h1>
      <Card className="feature-card">
        <h2>Resume vs Job Match</h2>
        {analysis?.score && <p>Overall Match Score: {analysis.score}%</p>}

        {analysis?.highlights?.length > 0 && (
          <div>
            <h3>Highlights</h3>
            <ul>
              {analysis.highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis?.recommendations?.length > 0 && (
          <div>
            <h3>Recommendations</h3>
            <ul>
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnalysisResults;