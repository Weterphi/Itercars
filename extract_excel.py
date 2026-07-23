import json
import base64
import pandas as pd

# The data starts with 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
# Let's read it from jobs.json
with open('jobs.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)
    
if jobs:
    job = jobs[0]
    file_data = job.get('file_url') or job.get('file_data')
    if file_data and file_data.startswith('data:'):
        # Extract base64 part
        b64_str = file_data.split(',')[1]
        decoded = base64.b64decode(b64_str)
        with open('rubel.xlsx', 'wb') as out_f:
            out_f.write(decoded)
        print("File saved to rubel.xlsx")
        
        # Read with pandas
        df = pd.read_excel('rubel.xlsx')
        print(df.head(10))
    else:
        print("No valid base64 file data found.")
else:
    print("No jobs found.")
