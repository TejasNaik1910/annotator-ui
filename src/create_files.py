########################## CREATE TXT FILES ########################
# # File contents
# content1 = "This is the content of summary1. Mark hallucinations here."
# content2 = "This is the content of summary2. Mark hallucinations here. Mark hallucinations there."
# content3 = "This is the content of summary3. Mark hallucinations here. Mark hallucinations there. Mark hallucinations everywhere."

# # Define file paths
# file1 = 'summary1.txt'
# file2 = 'summary2.txt'
# file3 = 'summary3.txt'

# # Write to files
# with open(file1, 'w') as f:
#     f.write(content1)

# with open(file2, 'w') as f:
#     f.write(content2)

# with open(file3, 'w') as f:
#     f.write(content3)

# print("Files created successfully.")

########################## CREATE JSON OBJECT TO FETCH SUMMARIES ########################

# import json

# # Define the JSON structure
# data = {
#     "summaries": ["summary1", "summary2", "summary3"]
# }

# # Define the output file name
# file_name = "summaries_list.json"

# # Write the dictionary to a JSON file
# with open(file_name, 'w') as json_file:
#     json.dump(data, json_file, indent=2)

# print(f"{file_name} created successfully.")

########################## CREATE HALLUCINATIONS CSV ########################
# import csv

# # Sample data
# records = [
#     {
#         "recordNumber": 1,
#         "hallucinationA": "Some data for A1",
#         "hallucinationB": "Some data for B1"
#     },
#     {
#         "recordNumber": 2,
#         "hallucinationA": "Some data for A2",
#         "hallucinationB": "Some data for B2"
#     },
#     {
#         "recordNumber": 3,
#         "hallucinationA": "Some data for A3",
#         "hallucinationB": "Some data for B3"
#     },
#     # Add more records as needed
# ]

# # File path for output
# output_file = 'hallucinations.csv'

# # Write data to CSV
# with open(output_file, mode='w', newline='') as file:
#     writer = csv.DictWriter(file, fieldnames=['recordNumber', 'hallucinationA', 'hallucinationB'])
#     writer.writeheader()
#     for record in records:
#         writer.writerow(record)

# print(f'CSV file {output_file} created successfully!')