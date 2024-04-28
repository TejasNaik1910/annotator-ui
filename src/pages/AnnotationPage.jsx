import React, { useState, useEffect } from "react";
import styles from "./AnnotationPage.module.css";
import { ANNOTATED_DATA_STRUCTURE, LABELS_STRUCTURE } from "../utils/constants";

const AnnotationPage = (props) => {
  const filePath = `data/${props.fileName}`;
  const [summaryData, setSummaryData] = useState("");
  const [annotatedData, setAnnotatedData] = useState(ANNOTATED_DATA_STRUCTURE);
  const [selectedCategory, setSelectedCategory] = useState({
    heading: null,
    subHeading: null,
    label: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(filePath);
        const summary = await response.text();
        setSummaryData(summary);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const highlightAnnotation = () => {
    const selection = window.getSelection();
    let text = selection.toString().trim();
    if (
      selection &&
      text !== "" &&
      selectedCategory.heading &&
      selectedCategory.label
    ) {
      // const start = selection.anchorOffset;
      // const end = selection.focusOffset;
      const updatedAnnotatedData = { ...annotatedData };
      if (selectedCategory.subHeading) {
        updatedAnnotatedData[selectedCategory.heading][
          selectedCategory.subHeading
        ][selectedCategory.label].evidence.push(text);
      } else {
        updatedAnnotatedData[selectedCategory.heading][
          selectedCategory.label
        ].evidence.push(text);
      }
      setAnnotatedData(updatedAnnotatedData);
    }
  };

  const labelButtonOnClicked = (heading, subHeading, label) => {
    setSelectedCategory({ heading, subHeading, label });
    console.log(heading, subHeading, label);
  };

  const generateLabelButtons = (heading, subHeading) => {
    const labels = LABELS_STRUCTURE[heading].labels
      ? LABELS_STRUCTURE[heading].labels
      : LABELS_STRUCTURE[heading][subHeading].labels;

    const labelToEvidencesMap =
      subHeading !== undefined
        ? annotatedData[heading][subHeading]
        : annotatedData[heading];

    return labels.map((label, index) => {
      let labelColor =
        label === "Omission"
          ? styles.highlightOmissionLabelColor
          : label === "Incorrect"
          ? styles.highlightIncorrectLabelColor
          : styles.highlightAmbiguousLabelColor;
      return (
        <div key={index} className={styles.labelButtonAndEvidenceContainer}>
          <button
            className={`${styles.labelButton} ${labelColor}`}
            onClick={() => labelButtonOnClicked(heading, subHeading, label)}
          >
            {label}
          </button>
          <div className={styles.evidenceContainer}>
            {labelToEvidencesMap[label].evidence.map((evidence, index) => (
              <p className={styles.evidenceParagraph} key={index}>
                {evidence}
              </p>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}> Annotation Dashboard </h1>
      <div className={styles.content}>
        <div className={styles.labelsContainer}>
          <h2>Labels</h2>
          {Object.keys(LABELS_STRUCTURE).map((heading, index) => (
            <div key={index} className={styles.categoryContainer}>
              <h3>{heading}</h3>
              {LABELS_STRUCTURE[heading].labels !== undefined
                ? generateLabelButtons(heading, undefined)
                : Object.keys(LABELS_STRUCTURE[heading]).map(
                    (subHeading, subIndex) => (
                      <div
                        key={subIndex}
                        className={styles.subCategoryContainer}
                      >
                        <h4>{subHeading}</h4>
                        {generateLabelButtons(heading, subHeading)}
                      </div>
                    )
                  )}
            </div>
          ))}
        </div>
        <div className={styles.summaryContainer}>
          <h2>Summary</h2>
          <div
            className={styles.summaryContent}
            onMouseUp={highlightAnnotation}
          >
            {summaryData.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationPage;
