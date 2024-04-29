// scripts.js
const paragraphText = document.getElementById('paragraph-text');
const annotationOptions = document.getElementsByName('annotation');
const submitButton = document.getElementById('submit-annotation');

submitButton.addEventListener('click', () => {
  const selectedText = window.getSelection().toString();
  const selectedAnnotation = Array.from(annotationOptions).find(option => option.checked).value;

  if (selectedText && selectedAnnotation) {
    // Send the selected text and annotation to the server
    const data = {
      text: selectedText,
      annotation: selectedAnnotation
    };

    fetch('/submit-annotation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': '{{ csrf_token }}' // Include the CSRF token for Django
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      // Handle the server response
      console.log('Annotation submitted successfully');
    })
    .catch(error => {
      console.error('Error submitting annotation:', error);
    });
  } else {
    alert('Please select text and an annotation option.');
  }
});