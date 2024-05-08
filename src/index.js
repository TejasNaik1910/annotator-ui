import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import "./index.css";
import AnnotationPage from "./pages/AnnotationPage";

function HighlightText() {
  const { model, id } = useParams(); // Get the model and id parameters from the URL
  const [initialText, setText] = useState("");

  useEffect(() => {
    const fetchText = async () => {
      const response = await fetch(
        `../data/summary_${model}_oncology-report-${id}.txt`
      );
      const data = await response.text();
      setText(data);
    };

    fetchText();
  }, [model, id]);

  const [highlights, setHighlights] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedRange, setSelectedRange] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const textAreaRef = useRef(null);

  const labels = ["hallucinationA", "hallucinationB", "Not Specified"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textAreaRef.current && !textAreaRef.current.contains(event.target)) {
        setShowDropdown(false);
        window.getSelection().removeAllRanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
    if (selection.rangeCount > 0 && selection.toString().trim() !== "") {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedRange(range);
      setDropdownPosition({ x: rect.left, y: rect.bottom + window.scrollY });
      setShowDropdown(true);
    }
  };

  const handleLabelChange = (event) => {
    const color = labelToColor(event.target.value);
    highlightSelection(color);
    setShowDropdown(false);
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
    let highlightedText = initialText;

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
  const handleDeleteHighlight = (index) => {
    const updatedHighlights = [...highlights];
    updatedHighlights.splice(index, 1);
    setHighlights(updatedHighlights);
  };

  return (
    <div ref={textAreaRef} style={{ textAlign: "center" }}>
      <h1 style={{ fontWeight: "bold", color: "black" }}>
        Annotation UI - UMass X Mendel AI
      </h1>
      {showDropdown && (
        <select
          value="Select Label"
          onChange={handleLabelChange}
          style={{
            position: "absolute",
            left: dropdownPosition.x,
            top: dropdownPosition.y,
          }}
        >
          <option disabled>Select Label</option>
          {labels.map((labelOption, index) => (
            <option key={index} value={labelOption}>
              {labelOption}
            </option>
          ))}
        </select>
      )}
      <section>
        <p
          onMouseUp={handleMouseUp}
          style={{ cursor: "pointer", userSelect: "text" }}
          dangerouslySetInnerHTML={renderHighlightedText()}
        />
      </section>
      <section>
        <button onClick={handleSubmit} disabled={isSubmitted}>
          Submit
        </button>
        {isSubmitted && (
          <h1 style={{ fontWeight: "bold", color: "darkblue" }}>
            ANNOTATION COMPLETED
          </h1>
        )}
      </section>
      <section>
        <h3 style={{ fontWeight: "bold" }}>HALLUCINATIONS</h3>
        <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Hallucination Type
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Evidence
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Evidence Indexes
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Color
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {highlights.map((highlight, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {highlight.label}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {highlight.text}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {highlight.startOffset} to {highlight.endOffset}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {highlight.color}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  <button onClick={() => handleDeleteHighlight(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const App = () => (
  <Router>
    <Route path="/:model/:id">
      <HighlightText />
      {/* <AnnotationPage /> */}
    </Route>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
