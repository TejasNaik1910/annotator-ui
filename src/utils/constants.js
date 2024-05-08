export const ANNOTATED_DATA_STRUCTURE = {
  "Patient Information": {
    Incorrect: {
      evidence: [],
    },
    Omission: {
      evidence: [],
    },
  },
  "Chronological Inconsistnecy": {
    Incorrect: {
      evidence: [],
    },
    Omission: {
      evidence: [],
    },
  },
  Reasoning: {
    Incorrect: {
      evidence: [],
    },
    Omission: {
      evidence: [],
    },
  },
  "Medical Event Inconsistency": {
    "Patient History": {
      Incorrect: {
        evidence: [],
      },
      Omission: {
        evidence: [],
      },
    },
    "Symptom/Diagnosis/Medical Procedures": {
      Ambiguous: {
        evidence: [],
      },
      Incorrect: {
        evidence: [],
      },
    },
    "Medicine Related Instructions": {
      Ambiguous: {
        evidence: [],
      },
      Incorrect: {
        evidence: [],
      },
    },
    Followup: {
      Incorrect: {
        evidence: [],
      },
    },
  },
  "Other Inconsistency": {
    Incorrect: {
      evidence: [],
    },
  },
};

export const LABELS_STRUCTURE = {
  "Patient Information": {
    labels: ["Incorrect", "Omission"],
  },
  "Chronological Inconsistnecy": {
    labels: ["Incorrect", "Omission"],
  },
  Reasoning: {
    labels: ["Incorrect", "Omission"],
  },
  "Medical Event Inconsistency": {
    "Patient History": {
      labels: ["Incorrect", "Omission"],
    },
    "Symptom/Diagnosis/Medical Procedures": {
      labels: ["Ambiguous", "Incorrect"],
    },
    "Medicine Related Instructions": {
      labels: ["Ambiguous", "Incorrect"],
    },
    Followup: {
      labels: ["Incorrect"],
    },
  },
  "Other Inconsistency": {
    labels: ["Incorrect"],
  },
};
