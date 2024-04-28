import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

function HighlightText() {
    const initialText = "This is a sample text that you can highlight. Select part of it to apply a label.";
    const [segments, setSegments] = useState([{ text: initialText, color: 'transparent' }]);
    const [highlights, setHighlights] = useState([]); // State to track highlight metadata
    const [label, setLabel] = useState('Select Label');

    const labels = ['hallucinationA', 'hallucinationB', 'Not Specified']; // Predefined labels

    const handleMouseUp = () => {
        if (!window.getSelection) return;
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim() !== '') {
            const selectedText = selection.toString();
            const range = selection.getRangeAt(0);
            const anchorNode = selection.anchorNode;
            const focusNode = selection.focusNode;
            const start = Math.min(anchorNode.parentNode.textContent.indexOf(selectedText), focusNode.parentNode.textContent.indexOf(selectedText));
            const end = start + selectedText.length;

            // Create the highlight object for record-keeping
            const highlight = {
                startOffset: start,
                endOffset: end,
                label,
                text: selectedText,
                color: label === 'hallucinationA' ? 'yellow' : label === 'hallucinationB' ? 'blue' : 'transparent'
            };

            // Only add highlights if a proper label is selected
            if (label !== 'Select Label' && selectedText !== '') {
                setHighlights([...highlights, highlight]);

                // Find the segment containing this text and update it
                const segmentIndex = segments.findIndex(segment => segment.text.includes(selectedText));
                if (segmentIndex !== -1) {
                    const segment = segments[segmentIndex];
                    const beforeText = segment.text.substring(0, start);
                    const afterText = segment.text.substring(end);
                    const newSegments = [
                        ...segments.slice(0, segmentIndex),
                        { text: beforeText, color: 'transparent' },
                        { text: selectedText, color: highlight.color },
                        { text: afterText, color: 'transparent' },
                        ...segments.slice(segmentIndex + 1),
                    ].filter(seg => seg.text); // Filter out any empty segments

                    setSegments(newSegments);
                }
            }

            selection.removeAllRanges(); // Clear selection
        }
    };

    const handleLabelChange = (event) => {
        setLabel(event.target.value);
    };

    return (
        <div>
            <select value={label} onChange={handleLabelChange} style={{ marginBottom: '10px' }}>
                <option disabled>Select Label</option>
                {labels.map((labelOption, index) => (
                    <option key={index} value={labelOption}>
                        {labelOption}
                    </option>
                ))}
            </select>
            <p onMouseUp={handleMouseUp} style={{ cursor: 'pointer', userSelect: 'text' }}>
                {segments.map((segment, index) => (
                    <span key={index} style={{ backgroundColor: segment.color }}>
                        {segment.text}
                    </span>
                ))}
            </p>
            <div>
                <h3>Highlights</h3>
                <ul>
                    {highlights.map((highlight, index) => (
                        <li key={index}>
                            Label: {highlight.label} - Text: "{highlight.text}" ({highlight.startOffset} to {highlight.endOffset}) - Color: {highlight.color}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HighlightText />
    </React.StrictMode>
);

reportWebVitals();





