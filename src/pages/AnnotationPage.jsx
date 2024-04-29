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