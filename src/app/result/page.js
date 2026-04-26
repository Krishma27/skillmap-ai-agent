"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Briefcase, 
  IndianRupee, 
  Gauge, 
  Clock, 
  Calendar, 
  BookOpen, 
  Lightbulb,
  TrendingUp,
  MapPin
} from "lucide-react";
import styles from "./page.module.css";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [skills, setSkills] = useState("");
  const [interest, setInterest] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const skillsParam = searchParams.get("skills");
    const interestParam = searchParams.get("interest");

    if (!skillsParam && !interestParam) {
      router.push("/");
      return;
    }

    setSkills(skillsParam || "");
    setInterest(interestParam || "");

    fetchAnalysis(skillsParam, interestParam);
  }, [searchParams, router]);

  const fetchAnalysis = async (s, i) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: s, interest: i }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analysis");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating your career strategy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
          SkillMap <span style={{color: 'var(--accent-green)'}}>AI</span>
        </div>
        <div className={styles.navLinks}>
          <span>About</span>
          <span>History</span>
          <span style={{color: 'var(--text-primary)'}}>Career Strategy</span>
        </div>
      </header>

      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={handleBack}>
          <ArrowLeft size={16} /> NEW ANALYSIS
        </button>
        <div className={styles.queryTags}>
          <div className={styles.queryTag}>Skills: {skills}</div>
          <div className={`${styles.queryTag} ${styles.queryTagHighlight}`}>{interest}</div>
        </div>
      </div>

      <main className={styles.resultCard}>
        <div className={styles.cardHeader}>ANALYSIS RESULTS</div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p style={{color: "var(--text-secondary)"}}>AI is analyzing your profile...</p>
          </div>
        )}

        {error && (
          <div style={{color: "red", textAlign: "center", padding: "2rem"}}>
            {error}
          </div>
        )}

        {analysis && !loading && !error && (
          <>
            {/* Career Paths */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}><Briefcase size={20} /></div>
                CAREER PATHS
              </h2>
              {analysis.careerPaths?.map((path, idx) => (
                <div key={idx} className={styles.listItem}>
                  <span className={styles.listItemHighlight}>{idx + 1}. {path.title}</span> — {path.description}
                </div>
              ))}
            </section>

            {/* Salary Insights */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}><IndianRupee size={20} /></div>
                SALARY INSIGHTS — INDIA
              </h2>
              {analysis.salaryInsights?.map((salary, idx) => (
                <div key={idx} className={styles.salaryCard}>
                  <div className={styles.salaryHeader}>
                    <div className={styles.salaryRole}>{salary.role}</div>
                    <div className={styles.salaryGrowth}><TrendingUp size={14} /> {salary.growth}</div>
                  </div>
                  
                  <div className={styles.salaryBarContainer}>
                    <div className={styles.salaryBarFill}></div>
                    <div className={styles.salaryDot}></div>
                  </div>
                  
                  <div className={styles.salaryLabels}>
                    <span>{salary.min}</span>
                    <span className={styles.salaryMedian}>{salary.median} median</span>
                    <span>{salary.max}</span>
                  </div>
                  
                  <div className={styles.locations}>
                    <MapPin size={14} />
                    {salary.locations?.map((loc, i) => (
                      <span key={i} className={styles.locationTag}>{loc}</span>
                    ))}
                  </div>
                </div>
              ))}
              <p style={{fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem"}}>
                Salary data is indicative of current Indian entry-level market ranges. Actual compensation varies by company, location, and candidate profile.
              </p>
            </section>

            {/* Skill Level */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}><Gauge size={20} /></div>
                SKILL LEVEL
              </h2>
              <div className={styles.listItem}>
                <span className={styles.listItemHighlight}>{analysis.skillLevel?.level}</span> — {analysis.skillLevel?.description}
              </div>
            </section>

            {/* Skill Gaps */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}><Clock size={20} /></div>
                SKILL GAPS
              </h2>
              <ul className={styles.bulletList}>
                {analysis.skillGaps?.map((gap, idx) => (
                  <li key={idx}><strong>{gap.title}</strong>: {gap.description}</li>
                ))}
              </ul>
            </section>

            {/* 4-Week Roadmap */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}><Calendar size={20} /></div>
                4-WEEK ROADMAP
              </h2>
              {analysis.roadmap?.map((week, idx) => (
                <div key={idx} className={styles.roadmapItem}>
                  <div className={styles.roadmapNumber}>{idx + 1}</div>
                  <div className={styles.roadmapContent}>
                    <div className={styles.roadmapTitle}>{week.title}</div>
                    <div className={styles.roadmapDesc}>{week.description}</div>
                  </div>
                </div>
              ))}
            </section>

            {/* Resources */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}><BookOpen size={20} /></div>
                RESOURCES
              </h2>
              <ul className={styles.bulletList}>
                {analysis.resources?.map((res, idx) => (
                  <li key={idx}><strong>{res.title}</strong> — {res.description}</li>
                ))}
              </ul>
            </section>

            {/* Final Insight */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}><Lightbulb size={20} /></div>
                FINAL INSIGHT
              </h2>
              <div className={styles.insightCard}>
                {analysis.finalInsight}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function Result() {
  return (
    <Suspense fallback={<div className={styles.loadingContainer}><div className={styles.spinner}></div></div>}>
      <ResultContent />
    </Suspense>
  );
}
