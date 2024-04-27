import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

function HighlightText() {
    const [text, setText] = useState("This is a sample text that you can highlight. Select part of it to apply a label.");
    const [highlights, setHighlights] = useState([]);
    const [label, setLabel] = useState('Select Label');

    const labels = ['hallucinationA', 'hallucinationB', 'Not Specified']; // Predefined labels

    const handleMouseUp = () => {
        if (!window.getSelection) return;
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim() !== '') {
            const range = selection.getRangeAt(0);
            const { startOffset, endOffset } = range;

            const highlight = {
                startOffset,
                endOffset,
                label,
                text: selection.toString()
            };

            // Only add highlights if a proper label is selected and text is actually selected
            if (label !== 'Select Label' && highlight.text !== '') {
                setHighlights([...highlights, highlight]);
            }

            // Clear selection to prevent duplication or misselection
            window.getSelection().removeAllRanges();
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
                {text}
            </p>
            <div>
                <h3>Highlights</h3>
                <ul>
                    {highlights.map((highlight, index) => (
                        <li key={index}>
                             Label: {highlight.label} - Text: "{highlight.text}" ({highlight.startOffset} to {highlight.endOffset})
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


