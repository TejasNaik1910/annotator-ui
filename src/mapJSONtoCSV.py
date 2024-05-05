import csv
import json
import os

# File paths
csv_file_path = '/Users/prathiksharv/Desktop/annotator_ui/src/hallucinations.csv'
json_folder_path = '/Users/prathiksharv/Desktop/annotator_ui/src/annotations_folder/'

# Load existing CSV into memory
csv_data = []
with open(csv_file_path, mode='r', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    csv_data = list(csv_reader)
    csv_fieldnames = csv_reader.fieldnames

# Helper function to extract text from JSON lists and format them as a list
def extract_text(data):
    if isinstance(data, list):
        return json.dumps([item['text'] for item in data])
    return "[]"

# Process each JSON file in the folder
for json_filename in os.listdir(json_folder_path):
    if json_filename.endswith('.json'):
        record_number = os.path.splitext(json_filename)[0]  # Get the file name without the extension

        with open(os.path.join(json_folder_path, json_filename), 'r') as json_file:
            json_data = json.load(json_file)

            # Find the matching row in CSV data and update it
            for row in csv_data:
                if row.get('recordNumber') == record_number:
                    for key in ['hallucinationA', 'hallucinationB']:
                        if key in csv_fieldnames:
                            row[key] = extract_text(json_data.get(key, []))

# Write the updated data back to the original CSV file
with open(csv_file_path, mode='w', newline='') as csv_file:
    csv_writer = csv.DictWriter(csv_file, fieldnames=csv_fieldnames)
    csv_writer.writeheader()
    csv_writer.writerows(csv_data)

print(f'CSV file {csv_file_path} has been updated successfully!')

