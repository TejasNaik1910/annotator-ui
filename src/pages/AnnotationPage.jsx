import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./AnnotationPage.module.css";

const AnnotationPage = (params) => {
  // Get the model and id parameters from the URL
  const { model, id } = useParams();
  const [summary, setSummary] = useState("");

  const onSubmitButtonClicked = () => {
    alert("Annotations submitted successfully!");
  };

  useEffect(() => {
    const fetchText = async () => {
      const response = await fetch(
        `../data/summary_${model}_oncology-report-${id}.txt`
      );
      const data = await response.text();
      setSummary(data);
    };

    fetchText();
  }, [model, id]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Annotation Dashboard - UMass x Mendel.ai</h1>
      <div className={styles.summaryContainer}>
        <h2 className={styles.summarySubHeading}>Summary</h2>
        <p className={styles.summaryText}>{summary}</p>
      </div>
      <div className={styles.tableContainer}>
        <h2>Annotation Table</h2>
        <table className={styles.annotationTable}>
          <thead>
            <tr>
              <th>Hallucination Type</th>
              <th>Evidence</th>
              <th>Start Index</th>
              <th>End Index</th>
              <th>Color</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Medical Event Inconsistency - Surgical/ Medications / Procedures
              </td>
              <td>
                This is the annotation page for the UMass x MendelAI project.
              </td>
              <td>Annotation</td>
              <td>Label</td>
              <td>Color</td>
            </tr>
            <tr>
              <td>
                Medical Event Inconsistency - Surgical/ Medications / Procedures
              </td>
              <td>
                This is the annotation page for the UMass x MendelAI project.
              </td>
              <td>Annotation</td>
              <td>Label</td>
              <td>Color</td>
            </tr>
            <tr>
              <td>
                Medical Event Inconsistency - Surgical/ Medications / Procedures
              </td>
              <td>
                This is the annotation page for the UMass x MendelAI project.
              </td>
              <td>Annotation</td>
              <td>Label</td>
              <td>Color</td>
            </tr>
            <tr>
              <td>
                Medical Event Inconsistency - Surgical/ Medications / Procedures
              </td>
              <td>
                This is the annotation page for the UMass x MendelAI project.
              </td>
              <td>Annotation</td>
              <td>Label</td>
              <td>Color</td>
            </tr>
            <tr>
              <td>
                Medical Event Inconsistency - Surgical/ Medications / Procedures
              </td>
              <td>
                This is the annotation page for the UMass x MendelAI project.
              </td>
              <td>Annotation</td>
              <td>Label</td>
              <td>Color</td>
            </tr>
            <tr>
              <td>
                Medical Event Inconsistency - Surgical/ Medications / Procedures
              </td>
              <td>
                This is the annotation page for the UMass x MendelAI project.
              </td>
              <td>Annotation</td>
              <td>Label</td>
              <td>Color</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className={styles.submitButton} onClick={onSubmitButtonClicked}>
        Submit
      </button>
    </div>
  );
};

export default AnnotationPage;
