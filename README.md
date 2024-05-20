# Annotator UI

This project is a web application for text annotation.

## Getting Started

To run the application in development mode, navigate to the project directory and execute the following command:

```bash
npm start
```

This will start the development server. Open http://localhost:3000 in your browser to view the app.

## Usage
When accessing the web application, you need to specify the model and note_id as URL parameters.

For example:

```bash
http://localhost:3000/gpt35/10000935-DS-21
```

In this example:

the model is gpt35
the note_id is 10000935-DS-21

## URL Format

```bash
http://localhost:3000/{model}/{note_id}
```
Replace {model} and {note_id} with the appropriate values for your use case.

## Features
The page automatically reloads when you make changes to the source files.
Words can be highlighted only once, meaning no overlapping highlights are allowed.