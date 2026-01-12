import React, { useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const CoverLetterGenerator = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCoverLetter("");
  };

  const generateCoverLetter = async () => {
    if (!file) {
      alert("Please upload resume PDF first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter job description.");
      return;
    }

    try {
      setGenerating(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const res = await api.post("/hr/cover-letter", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Backend returns object, so extract cover letter
      const letterText = res.data?.coverLetter || res.data?.text || "";

      if (!letterText) {
        alert("Cover letter generated but response is empty.");
        return;
      }

      setCoverLetter(letterText);
      alert("Cover Letter Generated Successfully!");
    } catch (err) {
      console.log("COVER LETTER ERROR:", err);
      alert(err.response?.data?.message || "Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  // ==========================
  // DOWNLOAD AS DOCX
  // ==========================
  const downloadDocx = async () => {
    if (!coverLetter) {
      alert("No cover letter available to download.");
      return;
    }

    // Split text into paragraphs
    const paragraphs = coverLetter.split("\n").map((line) => {
      return new Paragraph({
        children: [new TextRun(line)],
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Cover_Letter.docx");
  };

  return (
    <Layout>
      <div className="p-4">
        {/* HEADER */}
        <div className="mb-4">
          <h2>Cover Letter Generator</h2>
          <p className="text-muted">
            Upload your resume PDF and job description to generate a professional
            cover letter.
          </p>
        </div>

        {/* INPUT CARD */}
        <div className="card shadow-sm">
          <div className="card-header fw-bold">Generate Cover Letter</div>

          <div className="card-body">
            {/* PDF Upload */}
            <label className="fw-bold mb-2">Upload Resume PDF</label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={handleFileChange}
            />

            {/* Job Description */}
            <label className="fw-bold mt-3 mb-2">Job Description</label>
            <textarea
              className="form-control"
              rows="6"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
            ></textarea>

            <button
              className="btn btn-primary mt-3"
              onClick={generateCoverLetter}
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Cover Letter"}
            </button>
          </div>
        </div>

        {/* OUTPUT */}
        {coverLetter && (
          <div className="card shadow-sm mt-4">
            <div className="card-header fw-bold d-flex justify-content-between align-items-center">
              <span>Generated Cover Letter</span>

              <button className="btn btn-success btn-sm" onClick={downloadDocx}>
                Download
              </button>
            </div>

            <div className="card-body">
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {coverLetter}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoverLetterGenerator;
