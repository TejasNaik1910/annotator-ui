import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

function HighlightText() {
    const initialText = "This is a sample text that you can highlight. Select part of it to apply a label.";
    const [segments, setSegments] = useState([{ text: initialText, color: 'transparent' }]);
    const [highlights, setHighlights] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [selectedRange, setSelectedRange] = useState(null);
    const textAreaRef = useRef(null);

    const labels = ['hallucinationA', 'hallucinationB', 'Not Specified'];

    useEffect(() => {
        // Hide dropdown when clicking outside of the text area
        const handleClickOutside = (event) => {
            if (textAreaRef.current && !textAreaRef.current.contains(event.target)) {
                setShowDropdown(false);
                window.getSelection().removeAllRanges(); // Clear selection
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMouseUp = () => {
        if (!window.getSelection) return;
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim() !== '') {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelectedRange(range);
            setDropdownPosition({ x: rect.left, y: rect.bottom + window.scrollY });
            setShowDropdown(true);
        }
    };

    const handleLabelChange = (event) => {
        const label = event.target.value;
        const color = label === 'hallucinationA' ? 'yellow' : label === 'hallucinationB' ? 'blue' : 'transparent';

        if (selectedRange) {
            const selectedText = selectedRange.toString();
            const start = selectedRange.startOffset;
            const end = start + selectedText.length;

            const highlight = {
                startOffset: start,
                endOffset: end,
                label,
                text: selectedText,
                color
            };

            setHighlights([...highlights, highlight]);

            // Update segments with new highlight
            const newSegments = segments.map(segment => {
                if (segment.text.includes(selectedText)) {
                    const beforeText = segment.text.substring(0, start);
                    const afterText = segment.text.substring(end);
                    return [
                        { text: beforeText, color: 'transparent' },
                        { text: selectedText, color },
                        { text: afterText, color: 'transparent' }
                    ];
                }
                return segment;
            }).flat();

            setSegments(newSegments.filter(seg => seg.text)); // Remove empty text segments
            setSelectedRange(null); // Reset the selection range
        }
        setShowDropdown(false);
    };

    return (
        <div ref={textAreaRef}>
            {showDropdown && (
                <select value="Select Label" onChange={handleLabelChange} style={{ position: 'absolute', left: dropdownPosition.x, top: dropdownPosition.y }}>
                    <option disabled>Select Label</option>
                    {labels.map((labelOption, index) => (
                        <option key={index} value={labelOption}>
                            {labelOption}
                        </option>
                    ))}
                </select>
            )}
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





