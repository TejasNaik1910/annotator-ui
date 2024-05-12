import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./AnnotationPage.module.css";
import { LABELS_STRUCTURE, ANNOTATED_DATA_STRUCTURE } from "../utils/constants";

/**
 * AnnotationPage component displays a page for annotating text.
 *
 * @param {Object} params - Parameters for the component.
 * @param {string} params.model - The model parameter from the URL.
 * @param {string} params.id - The id parameter from the URL.
 */
const AnnotationPage = (params) => {
  // Get the model and id parameters from the URL
  const { model, id } = useParams();
  const [summary, setSummary] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const dropDownRef = useRef(null);
  const [showSubDropDown, setShowSubDropDown] = useState(false);
  const subDropDownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [subDropdownPosition, setSubDropdownPosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedRange, setSelectedRange] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [selectedHallucinationType, setSelectedHallucinationType] =
    useState(null);
  const [selectedHallucinationLabel, setSelectedHallucinationLabel] =
    useState(null);

  const LABELS = Object.keys(LABELS_STRUCTURE);
  const [annotatedData, setAnnotatedData] = useState(ANNOTATED_DATA_STRUCTURE);

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

  /**
   * Resets the selection in the dropdown.
   */
  const resetDropDownSelection = () => {
    setSelectedHallucinationType(null);
    setSelectedHallucinationLabel(null);
  };

  useEffect(() => {
    /**
     * Manages the visibility of a dropdown component based on user interaction.
     *
     * This function listens for mousedown events on the document and checks if the target
     * of the event is outside the dropdown component. If so, it hides the dropdown and clears
     * any text selection ranges.
     *
     * @param {MouseEvent} event - The mousedown event object.
     */

    const manageDropDownVisibility = (event) => {
      if (
        dropDownRef.current &&
        !subDropDownRef.current &&
        !dropDownRef.current.contains(event.target)
      ) {
        setShowDropDown(false);
        window.getSelection().removeAllRanges();
      }
      if (
        dropDownRef.current &&
        subDropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        !subDropDownRef.current.contains(event.target)
      ) {
        setShowDropDown(false);
        setShowSubDropDown(false);
        window.getSelection().removeAllRanges();
      }
      if (
        subDropDownRef.current &&
        !subDropDownRef.current.contains(event.target)
      ) {
        setShowSubDropDown(false);
        resetDropDownSelection();
      }
    };

    /**
     * Sets up an event listener to manage the visibility of a dropdown component.
     *
     * This effect listens for mousedown events on the document  and invokes the
     * `manageDropDownVisibility` function to hide the dropdown if the click is
     * outside the dropdown component.
     */
    document.addEventListener("mousedown", manageDropDownVisibility);

    // Clean up the event listener when the component unmounts or when the
    // dependency array changes.
    return () => {
      document.removeEventListener("mousedown", manageDropDownVisibility);
    };
  }, []);

  const highlightSelection = (color) => {
    if (selectedRange) {
      const selectedText = selectedRange.toString();
      const startOffset =
        selectedRange.startOffset +
        findNodeOffset(selectedRange.startContainer);
      const endOffset = startOffset + selectedText.length;

      const highlight = {
        startOffset,
        endOffset,
        label: colorToLabel(color),
        text: selectedText,
        color,
      };

      setHighlights([...highlights, highlight]);
      setSelectedRange(null);
    }
  };

  const findNodeOffset = (node) => {
    let offset = 0;
    while (node.previousSibling) {
      node = node.previousSibling;
      offset += node.textContent.length;
    }
    return offset;
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const dropDownWidth = 305;
    const subDropDownWidth = 192;
    if (selection.rangeCount > 0 && selection.toString().trim() !== "") {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedRange(range);

      if (rect.left + dropDownWidth + subDropDownWidth > window.innerWidth) {
        let dropDownStartX = rect.right - dropDownWidth;
        setDropdownPosition({
          x: dropDownStartX,
          y: rect.bottom + window.scrollY,
        });
        let subDropDownStartX = dropDownStartX - subDropDownWidth;
        setSubDropdownPosition({
          x: subDropDownStartX,
          y: rect.bottom + window.scrollY,
        });
      } else {
        setDropdownPosition({
          x: rect.left,
          y: rect.bottom + window.scrollY,
        });
        setSubDropdownPosition({
          x: rect.left + dropDownWidth,
          y: rect.bottom + window.scrollY,
        });
      }
      setShowDropDown(true);
    }
  };

  const handleHallucinationTypeChange = (event) => {
    setSelectedHallucinationType(event.target.value);
    setShowSubDropDown(true);
  };

  const highlightAnnotatedEvidence = () => {};

  const updateAnnotationData = (type, label, text, start_index, end_index) => {
    if (type != null && label != null) {
      let updatedAnnotatedData = { ...annotatedData };
      updatedAnnotatedData[type][label].evidences.push({
        text: selectedRange.toString().trim(),
        start_index: selectedRange.startOffset,
        end_index: selectedRange.endOffset,
      });
      setAnnotatedData(updatedAnnotatedData);
      highlightSelection(LABELS_STRUCTURE[type].color);
    }
  };

  const handleHallucinationLabelChange = (event) => {
    const hallucinationLabel = event.target.value;
    setSelectedHallucinationLabel(hallucinationLabel);

    const text = selectedRange.toString().trim();
    const start_index = selectedRange.startOffset;
    const end_index = selectedRange.endOffset;
    updateAnnotationData(
      selectedHallucinationType,
      hallucinationLabel,
      text,
      start_index,
      end_index
    );

    setShowDropDown(false);
    setShowSubDropDown(false);

    resetDropDownSelection();

    window.getSelection().removeAllRanges();
  };

  const handleSubmit = () => {
    const annotations = highlights.reduce((acc, highlight) => {
      if (!acc[highlight.label]) {
        acc[highlight.label] = [];
      }
      acc[highlight.label].push({
        text: highlight.text,
        startOffset: highlight.startOffset,
        endOffset: highlight.endOffset,
      });
      return acc;
    }, {});

    const jsonString = JSON.stringify(annotations, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "annotations.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsSubmitted(true);
  };

  const labelToColor = (label) => {
    switch (label) {
      case "hallucinationA":
        return "yellow";
      case "hallucinationB":
        return "blue";
      default:
        return "transparent";
    }
  };

  const colorToLabel = (color) => {
    switch (color) {
      case "yellow":
        return "hallucinationA";
      case "blue":
        return "hallucinationB";
      default:
        return "Not Specified";
    }
  };

  const renderHighlightedText = () => {
    // Sort highlights by their starting position in descending order
    const sortedHighlights = [...highlights].sort(
      (a, b) => b.startOffset - a.startOffset
    );

    // Start with plain text, replacing highlighted parts with span tags
    let highlightedText = summary;

    sortedHighlights.forEach((highlight) => {
      // Extract text between startOffset and endOffset
      const highlightedPart = highlightedText.substring(
        highlight.startOffset,
        highlight.endOffset
      );
      const spanTag = `<span style="background-color: ${highlight.color};">${highlightedPart}</span>`;

      // Replace the specific range with the span tag
      highlightedText =
        highlightedText.substring(0, highlight.startOffset) +
        spanTag +
        highlightedText.substring(highlight.endOffset);
    });

    return { __html: highlightedText };
  };

  const deleteAnnotation = (type, label, index) => {
    // Ask the user to confirm the deletion
    const isDeleteConfirmed = window.confirm(
      "Are you sure you want to delete this highlight?"
    );

    if (isDeleteConfirmed) {
      let updatedAnnotatedData = { ...annotatedData };
      updatedAnnotatedData[type][label].evidences.splice(index, 1);
      setAnnotatedData(updatedAnnotatedData);

      const updatedHighlights = [...highlights];
      updatedHighlights.splice(index, 1);
      setHighlights(updatedHighlights);
      // deleteAnnotatedEvidenceHighlight()
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Annotation Dashboard - UMass x Mendel.ai</h1>
      {showDropDown && (
        <select
          className={styles.selectDropdown}
          ref={dropDownRef}
          value={
            selectedHallucinationType
              ? selectedHallucinationType
              : "Choose Hallucination Type"
          }
          onChange={handleHallucinationTypeChange}
          style={{
            position: "absolute",
            left: dropdownPosition.x,
            top: dropdownPosition.y,
          }}
        >
          <option disabled>Choose Hallucination Type</option>
          {LABELS.map((labelOption, index) => (
            <option key={index} value={labelOption}>
              {labelOption}
            </option>
          ))}
        </select>
      )}
      {showSubDropDown && (
        <div>
          <select
            className={styles.selectDropdown}
            ref={subDropDownRef}
            id="subOption"
            value={selectedHallucinationLabel || "Choose Hallucination Label"}
            onChange={handleHallucinationLabelChange}
            style={{
              position: "absolute",
              left: subDropdownPosition.x,
              top: subDropdownPosition.y,
            }}
          >
            <option disabled>Choose Hallucination Label</option>
            {LABELS_STRUCTURE[selectedHallucinationType].labels.map(
              (label, idx) => (
                <option key={idx} value={label}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>
      )}
      <h2 className={styles.summarySubHeading}>Summary</h2>
      <div className={styles.summaryContainer}>
        <p
          onMouseUp={handleMouseUp}
          className={styles.summaryText}
          dangerouslySetInnerHTML={renderHighlightedText()}
        />
      </div>
      <h2 className={styles.tableHeading}>Annotation Table</h2>
      <div className={styles.tableContainer}>
        <table className={styles.annotationTable}>
          <thead>
            <tr>
              <th>Hallucination Type</th>
              <th>Label</th>
              <th>Evidence</th>
              <th>Start Index</th>
              <th>End Index</th>
              <th>Color</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(annotatedData).map((type, typeIdx) => {
              return Object.keys(annotatedData[type]).map((label, labelIdx) => {
                return annotatedData[type][label].evidences.map(
                  (evidence, evidenceIdx) => (
                    <tr key={`${typeIdx}-${labelIdx}-${evidenceIdx}`}>
                      <td>{type}</td>
                      <td>{label}</td>
                      <td>{evidence.text}</td>
                      <td>{evidence.start_index}</td>
                      <td>{evidence.end_index}</td>
                      <td>Red</td>
                      <td>
                        <button
                          onClick={() =>
                            deleteAnnotation(type, label, evidenceIdx)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                );
              });
            })}
          </tbody>
        </table>
      </div>
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default AnnotationPage;
