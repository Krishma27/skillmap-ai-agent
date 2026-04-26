"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart2, 
  Code, 
  Cpu, 
  Users, 
  BrainCircuit, 
  Sparkles 
} from "lucide-react";
import styles from "./page.module.css";

const PREDEFINED_INTERESTS = [
  { id: "analytics", label: "Data Analytics", icon: BarChart2 },
  { id: "frontend", label: "Frontend Dev", icon: Code },
  { id: "software", label: "Software Eng.", icon: Cpu },
  { id: "hr", label: "HR / Management", icon: Users },
  { id: "ml", label: "ML / AI", icon: BrainCircuit },
];

export default function Home() {
  const router = useRouter();
  const [skills, setSkills] = useState("");
  const [interest, setInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTagClick = (tagLabel) => {
    setInterest((prev) => {
      const interestsArray = prev.split(',').map(i => i.trim()).filter(Boolean);
      if (interestsArray.includes(tagLabel)) {
        return interestsArray.filter(i => i !== tagLabel).join(', ');
      } else {
        return [...interestsArray, tagLabel].join(', ');
      }
    });
  };

  const handleAnalyze = async () => {
    if (!skills.trim() || !interest.trim()) return;
    
    setIsLoading(true);
    try {
      // Encode state into URL and navigate to results page
      const params = new URLSearchParams({
        skills: skills,
        interest: interest,
      });
      router.push(`/result?${params.toString()}`);
    } catch (error) {
      console.error("Navigation error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
          SkillMap <span style={{color: 'var(--accent-green)'}}>AI</span>
        </div>
        <button className={styles.careerStrategyBtn}>Career Strategy</button>
      </header>

      <main>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Map Your Career
            <span className={styles.titleHighlight}>With Precision</span>
          </h1>
          <p className={styles.subtitle}>
            Enter your skills and area of interest. Receive a structured,
            actionable career strategy tailored for undergraduate professionals.
          </p>
        </section>

        <div className={styles.tagsContainer}>
          {PREDEFINED_INTERESTS.map((tag) => {
            const Icon = tag.icon;
            const isActive = interest.includes(tag.label);
            return (
              <button 
                key={tag.id} 
                className={`${styles.tag} ${isActive ? styles.active : ''}`}
                onClick={() => handleTagClick(tag.label)}
              >
                <Icon size={16} />
                {tag.label}
              </button>
            );
          })}
        </div>

        <div className={styles.formCard}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Your Skills</label>
            <textarea 
              className={styles.textarea}
              placeholder="e.g. Python, SQL, Excel, HTML, CSS, Communication..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Area of Interest</label>
            <textarea 
              className={styles.textarea}
              placeholder="e.g. Data Analytics, Web Development, Product Management..."
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
          </div>

          <button 
            className={styles.submitBtn}
            onClick={handleAnalyze}
            disabled={isLoading || !skills.trim() || !interest.trim()}
          >
            <Sparkles size={20} />
            {isLoading ? "Analyzing..." : "Analyze My Career Path"}
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        Powered by advanced AI analysis — Results are advisory and not a guarantee of placement.
      </footer>
    </div>
  );
}
