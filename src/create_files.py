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