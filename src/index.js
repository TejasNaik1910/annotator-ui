import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

function HighlightText({ texts }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [segments, setSegments] = useState([{ text: texts[currentTextIndex], color: 'transparent' }]);
    const [highlights, setHighlights] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [selectedRange, setSelectedRange] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false); // State to track submission status
    const textAreaRef = useRef(null);

    const labels = ['hallucinationA', 'hallucinationB', 'Not Specified'];

    useEffect(() => {
        setSegments([{ text: texts[currentTextIndex], color: 'transparent' }]);
    }, [currentTextIndex, texts]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (textAreaRef.current && !textAreaRef.current.contains(event.target)) {
                setShowDropdown(false);
                window.getSelection().removeAllRanges();
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
            setSelectedRange(null);
        }
        setShowDropdown(false);
    };

    const handleSubmit = () => {
        const annotations = highlights.reduce((acc, highlight) => {
            if (!acc[highlight.label]) {
                acc[highlight.label] = [];
            }
            acc[highlight.label].push(highlight.text);
            return acc;
        }, {});
    
        const jsonString = JSON.stringify(annotations, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `annotations-${currentTextIndex}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        setIsSubmitted(true); // Set submission status to true
           // Move to the next text if it exists
        if (currentTextIndex + 1 < texts.length) {
            setCurrentTextIndex(currentTextIndex + 1);
            setIsSubmitted(false); // Reset submission status for the next text
        }
    };
    const handleDeleteHighlight = (index) => {
        const deletedHighlight = highlights[index];
        const newHighlights = highlights.filter((_, i) => i !== index);
        setHighlights(newHighlights);
    
        const newSegments = segments.map(segment => {
            if (segment.text === deletedHighlight.text) {
                return { text: segment.text, color: 'transparent' };
            }
            return segment;
        });
    
        setSegments(newSegments);
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
            <button onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
            {isSubmitted && <p> Annotation Completed ! </p>} {/* Display completion message */}
            <section>
            <h3 style={{ fontWeight: 'bold' }}>HALLUCINATIONS</h3>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Hallucination Type</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Evidence</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Evidence Indexes</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Color</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {highlights.map((highlight, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{highlight.label}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{highlight.text}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {highlight.startOffset} to {highlight.endOffset}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{highlight.color}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}><button onClick={() => handleDeleteHighlight(index)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
            <button onClick={() => setCurrentTextIndex(currentTextIndex + 1)}>Next Text</button>
        </div>
    );
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
}

async function loadTextFiles() {
    const file1 = await fetch('data/summary_gpt35_oncology-report-10000980-DS-23.txt').then(response => response.blob());
    const file2 = await fetch('data/summary_gpt35_oncology-report-10001401-DS-20.txt').then(response => response.blob());
    const file3 = await fetch('data/summary_gpt35_oncology-report-10002221-DS-11.txt').then(response => response.blob());

    const text1 = await readFile(file1);
    const text2 = await readFile(file2);
    const text3 = await readFile(file3);

    return [text1, text2, text3];
}

loadTextFiles().then(texts => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <HighlightText texts={texts} />
        </React.StrictMode>
    );
});

reportWebVitals();