import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import "./index.css";
//import AnnotationPage from "./pages/AnnotationPage";

function HighlightText() {
  const { model, id } = useParams(); // Get the model and id parameters from the URL
  const [initialText, setText] = useState("");

  useEffect(() => {
    const fetchText = async () => {
      const response = await fetch(
        `../data/${model}-summary-${id}.txt`
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
  const [showIncorrectReasoning, setShowIncorrectReasoning] = useState(false);
  const [showChronologicalIncon, setShowChronologicalIncon] = useState(false);
  const [incorrectReasoningText, setIncorrectReasoningText] = useState("");
  const [chronologicalInconText, setChronologicalInconText] = useState("");
  const textAreaRef = useRef(null);

  const labels = [
    "Incorrect Patient Information",
    "Omitted Patient Information",
    "Incorrect Patient History",
    "Omitted Patient History",
    "Incorrect Symptoms/Diagnosis",
    "Omitted Symptoms/Diagnosis",
    "Incorrect Medicinal Instructions",
    "Omitted Medicinal Instructions",
    "Incorrect Followup",
    "Omitted Followup",
  ];

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

  const highlightSelection = (color, omittedDetails = '') => {
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
        omittedDetails,
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
    const label = event.target.value;
    let omittedDetails = '';
  
    if (label.includes('Omitted')) {
      omittedDetails = prompt('Please provide details for the omitted information:');
    }
  
    highlightSelection(color, omittedDetails);
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
        omittedDetails: highlight.omittedDetails, // Add omittedDetails to the JSON
      });
      return acc;
    }, {});
  
    const jsonString = JSON.stringify(annotations, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `annotations-${model}-${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    setIsSubmitted(true);
  };

  const labelToColor = (label) => {
    switch (label) {
      case "Incorrect Patient Information":
        return "#ff6ec7"; // Neon Pink
      case "Omitted Patient Information":
        return "#00ffff"; // Neon Cyan
      case "Incorrect Patient History":
        return "#ffff00"; // Neon Yellow
      case "Omitted Patient History":
        return "#ffa500"; // Neon Orange
      case "Incorrect Symptoms/Diagnosis":
        return "#CCCCFF"; // Neon Periwinkle
      case "Omitted Symptoms/Diagnosis":
        return "#ff00ff"; // Neon Magenta
      case "Incorrect Medicinal Instructions":
        return "#98FF98"; // Neon Mint
      case "Omitted Medicinal Instructions":
        return "#C87137"; // Neon Brown
      case "Incorrect Followup":
        return "#ff007f"; // Neon Hot Pink
      case "Omitted Followup":
        return "#ff91a4"; // Neon Peach
      default:
        return "transparent";
    }
  };

  const colorToLabel = (color) => {
    switch (color) {
      case "#ff6ec7":
        return "Incorrect Patient Information";
      case "#00ffff":
        return "Omitted Patient Information";
      case "#ffff00":
        return "Incorrect Patient History";
      case "#ffa500":
        return "Omitted Patient History";
      case "#CCCCFF":
        return "Incorrect Symptoms/Diagnosis";
      case "#ff00ff":
        return "Omitted Symptoms/Diagnosis";
      case "#98FF98":
        return "Incorrect Medicinal Instructions";
      case "#C87137":
        return "Omitted Medicinal Instructions";
      case "#ff007f":
        return "Incorrect Followup";
      case "#ff91a4":
        return "Omitted Followup";
      default:
        return "Not Specified";
    }
  };

  const colorCodeToName = (colorCode) => {
    switch (colorCode) {
      case "#ff6ec7":
        return "Neon Pink";
      case "#00ffff":
        return "Neon Cyan";
      case "#ffff00":
        return "Neon Yellow";
      case "#ffa500":
        return "Neon Orange";
      case "#CCCCFF":
        return "Neon Periwinkle";
      case "#ff00ff":
        return "Neon Magenta";
      case "#98FF98":
        return "Neon Mint";
      case "#C87137":
        return "Neon Brown";
      case "#ff007f":
        return "Neon Hot Pink";
      case "#ff91a4":
        return "Neon Peach";
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

  const getWordOffsets = (text, charStart, charEnd) => {
    // Split text into words, considering punctuation as separate "words"
    const regex = /(\W+)/; // Matches any non-word character including spaces
    let words = text.split(regex).filter(Boolean); // Split and filter out empty strings
    let currentPos = 0; // Current position in the string
    let startWordIndex = -1;
    let endWordIndex = -1;
    let wordIndex = 0;

    words.forEach((word, index) => {
      let wordStart = currentPos;
      let wordEnd = wordStart + word.length - 1;

      if (charStart >= wordStart && charStart <= wordEnd) {
        startWordIndex = wordIndex; // Set start index when range starts within this word
      }
      if (charEnd >= wordStart && charEnd <= wordEnd) {
        endWordIndex = wordIndex; // Set end index when range ends within this word
      }

      // Update current position to the next character after the current word
      currentPos += word.length;

      // Check if the word is not just punctuation or space
      if (!word.match(/^\W+$/)) {
        wordIndex++; // Increment word index only for actual words
      }
    });

    return { startWordIndex, endWordIndex };
  };

  const handleDeleteHighlight = (index) => {
    // Ask the user to confirm the deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this highlight?"
    );
    if (confirmDelete) {
      const updatedHighlights = [...highlights];
      updatedHighlights.splice(index, 1);
      setHighlights(updatedHighlights);
    }
  };

  const handleReasoningSubmit = () => {
    setHighlights([...highlights, {
      startOffset: "",
      endOffset: "",
      label: "Incorrect Reasoning",
      text: incorrectReasoningText,
      color: ""
    }]);
    setShowIncorrectReasoning(false);
    setIncorrectReasoningText("");
  };

  const handleChronologicalSubmit = () => {
    setHighlights([...highlights, {
      startOffset: "",
      endOffset: "",
      label: "Chronological Inconsistency",
      text: chronologicalInconText,
      color: ""
    }]);
    setShowChronologicalIncon(false);
    setChronologicalInconText("");
  };

  return (
    <div ref={textAreaRef} style={{ textAlign: "center" }}>
      <h1 style={{ fontWeight: "bold", color: "black" }}>
        Annotation UI - UMass X Mendel AI
      </h1>
      <h2 style={{ fontWeight: "bold", color: "black" }}>
        Summary
      </h2>
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
        <div style={{ maxHeight: "30vh", overflowY: "scroll" , padding: "0 40px" }}>
          <div
            onMouseUp={handleMouseUp}
            style={{ cursor: "pointer", userSelect: "text" , whiteSpace: "pre-wrap", textAlign: "left"}}
            dangerouslySetInnerHTML={renderHighlightedText()}
          />
        </div>
      </section>
      <section style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ width: "50%", textAlign: "center", position: "relative" }}>
          <button style={{ backgroundColor: "darkblue", color: "white" }} onClick={() => setShowIncorrectReasoning(!showIncorrectReasoning)}>
            Incorrect Reasoning
          </button>
          {showIncorrectReasoning && (
            <div style={{ marginTop: "10px" }}>
              <textarea
                value={incorrectReasoningText}
                onChange={(e) => setIncorrectReasoningText(e.target.value)}
                style={{ width: "300px", height: "100px" }}
              />
              <div style={{ marginTop: "10px" }}>
                <button onClick={handleReasoningSubmit}>Submit</button>
                <button onClick={() => setShowIncorrectReasoning(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
        <div style={{ width: "50%", textAlign: "center", position: "relative" }}>
          <button style={{ backgroundColor: "darkblue", color: "white" }} onClick={() => setShowChronologicalIncon(!showChronologicalIncon)}>
            Chronological Inconsistency
          </button>
          {showChronologicalIncon && (
            <div style={{ marginTop: "10px" }}>
              <textarea
                value={chronologicalInconText}
                onChange={(e) => setChronologicalInconText(e.target.value)}
                style={{ width: "300px", height: "100px" }}
              />
              <div style={{ marginTop: "10px" }}>
                <button onClick={handleChronologicalSubmit}>Submit</button>
                <button onClick={() => setShowChronologicalIncon(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </section>
      <section style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%" }}>
        <div style={{ width: "100%", maxHeight: "30vh", overflowY: "scroll" }}>
          <h3 style={{ fontWeight: "bold" }}>HALLUCINATIONS</h3>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid black', padding: '8px' }}>
        Hallucination Type
      </th>
      <th style={{ border: '1px solid black', padding: '8px' }}>
        Evidence
      </th>
      <th style={{ border: '1px solid black', padding: '8px' }}>
        Word Count Index
      </th>
      <th style={{ border: '1px solid black', padding: '8px' }}>
        Color
      </th>
      <th style={{ border: '1px solid black', padding: '8px' }}>
        Omitted Details
      </th>
      <th style={{ border: '1px solid black', padding: '8px' }}>
        Delete
      </th>
    </tr>
  </thead>
  <tbody>
    {highlights.map((highlight, index) => {
      const { startWordIndex, endWordIndex } = getWordOffsets(
        initialText,
        highlight.startOffset,
        highlight.endOffset
      );
      return (
        <tr key={index}>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            {highlight.label}
          </td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            {highlight.text}
          </td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            {endWordIndex - startWordIndex > 1
              ? `${startWordIndex} to ${endWordIndex}`
              : `${startWordIndex}`}
          </td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            {colorCodeToName(highlight.color)}
          </td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            {highlight.omittedDetails}
          </td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            <button
              style={{
                backgroundColor: 'black',
                color: 'white',
                fontWeight: 'bold',
              }}
              onClick={() => handleDeleteHighlight(index)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
        </div>
      </section>
      <section>
        {/* <button style={{ backgroundColor: "blueviolet", color: "white", fontWeight: "bold" }} onClick={handleSubmit} disabled={isSubmitted}>
          SUBMIT
        </button>
        {isSubmitted && (
          <h1 style={{ fontWeight: "bold", color: "darkblue" }}>
            ANNOTATION COMPLETED
          </h1>
        )} */}
        <button
          style={{
            backgroundColor: isSubmitted ? "grey" : "darkblue",
            color: "white",
            fontWeight: "bold",
            cursor: isSubmitted ? "not-allowed" : "pointer",
          }}
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          SUBMIT
        </button>
        {isSubmitted && (
          <h1 style={{ fontWeight: "bold", color: "darkblue" }}>
            ANNOTATION COMPLETED
          </h1>
        )}

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
