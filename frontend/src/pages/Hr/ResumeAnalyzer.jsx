import React, { useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysisResult(null);
  };

  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload a resume PDF first.");
      return;
    }

    try {
      setAnalyzing(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/hr/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysisResult(res.data);
      alert("Resume analyzed successfully!");
    } catch (err) {
      console.log("RESUME ANALYSIS ERROR:", err);
      alert(err.response?.data?.message || "Failed to analyze resume");
    } finally {
      setAnalyzing(false);
    }
  };

  // ================================
  // FORMAT STRING INTO LIST
  // ================================
  const formatList = (text) => {
    if (!text) return [];

    return text
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  return (
    <Layout>
      <div className="p-4" style={{ maxWidth: "100%", overflowX: "hidden" }}>
        {/* HEADER */}
        <div className="mb-4">
          <h2>Resume Analyzer</h2>
          <p className="text-muted">
            Upload a resume PDF and get AI analysis (skills, strengths, weaknesses, etc.)
          </p>
        </div>

        {/* UPLOAD CARD */}
        <div className="card shadow-sm" style={{ maxWidth: "100%" }}>
          <div className="card-header fw-bold">Upload Resume PDF</div>

          <div className="card-body">
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={handleFileChange}
            />

            <button
              className="btn btn-primary mt-3"
              onClick={analyzeResume}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        </div>

        {/* RESULT CARD */}
        {analysisResult && (
          <div className="card shadow-sm mt-4" style={{ maxWidth: "100%" }}>
            <div className="card-header fw-bold">Resume Analysis Result</div>

            <div className="card-body">
              <div className="row">
                {/* LEFT COLUMN */}
                <div className="col-md-6">
                  {/* SCORE */}
                  <div className="mb-4">
                    <h5 className="fw-bold">Score</h5>
                    <h3 className="text-success fw-bold">
                      {analysisResult.score} / 100
                    </h3>
                  </div>

                  {/* SKILLS */}
                  <div>
                    <h5 className="fw-bold">Skills</h5>

                    <div
                      style={{
                        maxHeight: "250px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                        background: "#f8f9fa",
                      }}
                    >
                      <ul className="mb-0 ps-3">
                        {formatList(analysisResult.skills).map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-md-6">
                  {/* STRENGTHS */}
                  <div className="mb-4">
                    <h5 className="fw-bold">Strengths</h5>

                    <div
                      style={{
                        maxHeight: "150px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                        background: "#f8f9fa",
                      }}
                    >
                      <ul className="mb-0 ps-3">
                        {formatList(analysisResult.strengths).map(
                          (strength, index) => (
                            <li key={index}>{strength}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* WEAKNESSES */}
                  <div className="mb-4">
                    <h5 className="fw-bold">Weaknesses</h5>

                    <div
                      style={{
                        maxHeight: "120px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                        background: "#f8f9fa",
                        wordBreak: "break-word",
                      }}
                    >
                      {analysisResult.weaknesses}
                    </div>
                  </div>

                  {/* FIT FOR ROLE */}
                  <div>
                    <h5 className="fw-bold">Fit for Role</h5>

                    <div
                      style={{
                        maxHeight: "140px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                        background: "#f8f9fa",
                        wordBreak: "break-word",
                      }}
                    >
                      {analysisResult.fitForRole}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResumeAnalyzer;
