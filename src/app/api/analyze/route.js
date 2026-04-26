import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    const { skills, interest } = await req.json();

    if (!skills || !interest) {
      return NextResponse.json(
        { error: 'Skills and interest are required.' },
        { status: 400 }
      );
    }

    // Attempt to use API key if provided in env, else use a fallback or mock response.
    // For a college project, they might run this without setting the key first, 
    // so we provide a helpful error message if it's missing.
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Returning mock data for demonstration.");
      // Return realistic mock data if API key is missing so the UI still works
      return NextResponse.json({
        careerPaths: [
          { title: "Machine Learning Intern / Junior ML Engineer", description: "Fits because your Python basics and SQL can quickly translate into building simple ML pipelines." },
          { title: "Data Analyst (ML-leaning) / Analytics Intern", description: "SQL is directly usable for querying data, and Python helps for analysis. A practical entry into ML." }
        ],
        salaryInsights: [
          { role: "Machine Learning Intern / Junior ML Engineer", growth: "High Growth", min: "₹4.5 LPA", median: "₹7.5 LPA", max: "₹12 LPA", locations: ["Bangalore", "Hyderabad", "Pune"] },
          { role: "Data Analyst (ML-leaning) / Analytics Intern", growth: "Moderate Growth", min: "₹3.5 LPA", median: "₹6 LPA", max: "₹9.5 LPA", locations: ["Bangalore", "Mumbai", "Pune"] }
        ],
        skillLevel: {
          level: "Beginner",
          description: "You have Python basics and SQL plus basic HTML/CSS/JS, which is a good foundation, but ML/AI roles typically require stronger Python, math, and ML tooling experience."
        },
        skillGaps: [
          { title: "Core ML algorithms", description: "scikit-learn (regression, classification, clustering) and model evaluation." },
          { title: "Math foundations", description: "probability, statistics, linear algebra basics for ML intuition." },
          { title: "Data preprocessing", description: "feature engineering, encoding, scaling, leakage handling." }
        ],
        roadmap: [
          { title: "Week 1 — Strengthen Python for Data", description: "Learn numpy/pandas essentials (arrays, DataFrames, groupby). Create a GitHub repo and push daily practice." },
          { title: "Week 2 — ML Fundamentals with scikit-learn", description: "Learn train/test split, pipelines, scaling. Build 2 mini-models (classification and regression)." },
          { title: "Week 3 — End-to-End Project (Portfolio)", description: "Pick one dataset and create a complete workflow: EDA, feature engineering, baseline model, error analysis." },
          { title: "Week 4 — Deploy & Interview Prep", description: "Create a small demo (Streamlit or Flask). Start ML interview basics." }
        ],
        resources: [
          { title: "Kaggle Micro-courses", description: "Python, Pandas, Intro to ML for structured practice." },
          { title: "scikit-learn Official Documentation", description: "For pipelines, preprocessing, and model evaluation." }
        ],
        finalInsight: "Treat ML/AI as an engineering workflow, not just algorithms: your fastest route from Python+SQL basics is to build one clean end-to-end project on GitHub, and use it to prove you can ship."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert full-stack career advisor and tech strategist.
      Analyze the following candidate profile:
      Skills: ${skills}
      Area of Interest: ${interest}

      Generate a structured, actionable career strategy tailored for an undergraduate professional in India.
      Respond strictly in JSON format matching the following schema.
      Do not include markdown code blocks or backticks in the response, just the raw JSON object.
      
      {
        "careerPaths": [
          { "title": "Role Title", "description": "Why it fits" }
        ],
        "salaryInsights": [
          { "role": "Role Title", "growth": "High Growth | Moderate Growth", "min": "₹X LPA", "median": "₹Y LPA", "max": "₹Z LPA", "locations": ["City1", "City2"] }
        ],
        "skillLevel": {
          "level": "Beginner | Intermediate | Advanced",
          "description": "Overall assessment of current skills"
        },
        "skillGaps": [
          { "title": "Topic", "description": "What needs to be learned" }
        ],
        "roadmap": [
          { "title": "Week 1 - Topic", "description": "Actionable tasks" },
          { "title": "Week 2 - Topic", "description": "Actionable tasks" },
          { "title": "Week 3 - Topic", "description": "Actionable tasks" },
          { "title": "Week 4 - Topic", "description": "Actionable tasks" }
        ],
        "resources": [
          { "title": "Resource Name", "description": "Why use it" }
        ],
        "finalInsight": "A single powerful sentence summarizing the strategy"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    const parsedData = JSON.parse(resultText);

    return NextResponse.json(parsedData);
    
  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json(
      { error: 'Failed to generate career strategy. Please try again.' },
      { status: 500 }
    );
  }
}
