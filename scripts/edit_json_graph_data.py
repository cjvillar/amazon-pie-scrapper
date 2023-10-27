import json
from collections import defaultdict


with open('./avePie.json', 'r') as json_file:
    data = json.load(json_file)

#create dictionary to aggregate data by month
monthly_data = defaultdict(list)

#process the original data
for entry in data:
    date = entry["Date"]
    month_year = date[:7]  # extract the YYYY-MM part of the date
 
    # append the entry to the corresponding month
    monthly_data[month_year].append(entry)

# create a list with one data point per month
result = []
for month_data in monthly_data.values():
    if month_data:
        #gets first entry of each month
        result.append(month_data[0])

# convert to JSON
result_json = json.dumps(result, indent=4)

# write to a file
with open('modified_data.json', 'w') as json_file:
    json_file.write(result_json)
