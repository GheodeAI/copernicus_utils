import os
import ast

# First step: read the config file to get the API keys and URL as variables
config_file = 'CONFIG.conf'
actual_path = os.getcwd()
config_file = os.path.join(actual_path, config_file)
# Verify that the config file exists and read its content
if not os.path.isfile(config_file):
    raise FileNotFoundError(f"Configuration file '{config_file}' not found.")

# Read the config file to get the API keys and URL as variables
CDSAPI_URL = ''
API_KEYS = []
Number_of_Users = 0
JOBS_PER_USER = 1  # Default value
DATASETS = []
VARIABLES = []

with open(config_file, 'r') as file:
    content = file.read()
    lines = content.split('\n')
    
    for line in lines:
        line = line.strip()
        
        # Skip comments and empty lines
        if line.startswith('#') or not line:
            continue
            
        # Parse API URL
        if line.startswith('CDSAPI_URL='):
            CDSAPI_URL = line.split('=', 1)[1].strip()
            
        # Parse Jobs per User
        elif line.startswith('JOBS_PER_USER='):
            try:
                JOBS_PER_USER = int(line.split('=', 1)[1].strip())
            except ValueError:
                print("Warning: Invalid JOBS_PER_USER value, using default (1)")
                JOBS_PER_USER = 1
            
        # Parse API Keys
        elif line.startswith('CDSAPI_KEY_'):
            key = line.split('=', 1)[1].strip()
            API_KEYS.append(key)
            
        # Parse Datasets
        elif line.startswith('DATASET_'):
            dataset = line.split('=', 1)[1].strip()
            DATASETS.append(dataset)
            
        # Parse Variables (Python dictionary format)
        elif line.startswith('VARIABLE_'):
            # Collect the complete dictionary across multiple lines
            var_def = line.split('=', 1)[1].strip()
            if '{' in var_def:
                brace_count = var_def.count('{') - var_def.count('}')
                current_index = lines.index(line) + 1
                
                # Continue reading lines until we close all braces
                while brace_count > 0 and current_index < len(lines):
                    next_line = lines[current_index].strip()
                    if not next_line.startswith('#'):
                        var_def += ' ' + next_line
                        brace_count += next_line.count('{') - next_line.count('}')
                    current_index += 1
                
                # Parse the dictionary safely
                try:
                    var_dict = ast.literal_eval(var_def)
                    VARIABLES.append(var_dict)
                except (SyntaxError, ValueError) as e:
                    print(f"Warning: Could not parse variable definition: {e}")
                    continue

# Print the loaded configuration for verification
print(f"CDSAPI_URL: {CDSAPI_URL}")
Number_of_Users = len(API_KEYS)
print(f"Available API Keys (number_of_users: {Number_of_Users}):")
print(API_KEYS)
print(f"Jobs per user: {JOBS_PER_USER}")
print(f"Total concurrent containers: {Number_of_Users * JOBS_PER_USER}")
print("\nDatasets to download:")
print(DATASETS)
print("\nVariables to download:")
for i, var in enumerate(VARIABLES, 1):
    print(f"  Variable {i}: {var['name']}")
    print(f"    Pressure levels: {var['pressure_levels']}")
    print(f"    Dataset ID: {var['dataset_id']}")
    print(f"    Years: {var['start_year']} - {var['end_year']}")
    print(f"    Region: {var['region']}")
    print(f"    Months: {var['months']}")
    print(f"    Days: {var['days']}")
    print(f"    Hours: {var['hours']}")


# Third step: generate all the folders and paths to download the data
# Loop through each variable and create directory structure

actual_path = os.getcwd()

for var in VARIABLES:
    # Select the corresponding dataset
    dataset = DATASETS[var['dataset_id'] - 1]
    var_name = var['name']
    pressure_levels = var['pressure_levels']
    
    # Check if pressure level is 0 or [0] (no pressure level)
    if pressure_levels == [0]:
        dir_path = os.path.join(actual_path, "data", dataset, var_name)
        os.makedirs(dir_path, exist_ok=True)
        print(f"Created directory: {dir_path}")
    else:
        # Loop for all pressure levels
        for pressure in pressure_levels:
            dir_path = os.path.join(actual_path, "data", dataset, var_name, str(pressure))
            os.makedirs(dir_path, exist_ok=True)
            print(f"Created directory: {dir_path}")


# Fourth step: generete the docker structure
# Create docker directory
docker_path = os.path.join(actual_path, 'docker')
os.makedirs(docker_path, exist_ok=True)
# Create a directory for each user-job combination
for i in range(Number_of_Users):
    for j in range(JOBS_PER_USER):
        user_dir = os.path.join(docker_path, f'user_{i+1}_job_{j+1}')
        os.makedirs(user_dir, exist_ok=True)
        print(f"Created docker user directory: {user_dir}")

# Generate the docker-compose file
docker_compose_file = os.path.join(docker_path, 'docker-compose.yml')
with open(docker_compose_file, 'w') as dc_file:
    dc_file.write("services:\n")
    for i in range(Number_of_Users):
        for j in range(JOBS_PER_USER):
            dc_file.write(f"  user_{i+1}_job_{j+1}:\n")
            dc_file.write(f"    build:\n")
            dc_file.write(f"      context: ./user_{i+1}_job_{j+1}\n")
            dc_file.write(f"      dockerfile: Dockerfile\n")
            dc_file.write(f"    container_name: cdsapi_user_{i+1}_job_{j+1}\n")
            dc_file.write("    volumes:\n")
            dc_file.write(f"      - ../data:/data\n")
            dc_file.write("\n")

# Generate Dockerfile for each user-job combination
for i in range(Number_of_Users):
    for j in range(JOBS_PER_USER):
        dockerfile_path = os.path.join(docker_path, f'user_{i+1}_job_{j+1}', 'Dockerfile')
        with open(dockerfile_path, 'w') as df_file:
            df_file.write("FROM --platform=linux/amd64 ubuntu:24.04\n")
            df_file.write("ENV DEBIAN_FRONTEND=noninteractive\n")
            df_file.write("RUN apt-get update && \\\n")
            df_file.write("    apt-get install -y python3 python3-pip curl && \\\n")
            df_file.write("    rm -rf /var/lib/apt/lists/*\n")
            df_file.write("RUN pip install --break-system-packages \"cdsapi>=0.7.7\"\n")
            df_file.write("WORKDIR /app\n")
            df_file.write("COPY download_era5.py .\n")
            df_file.write("CMD [\"python3\", \"download_era5.py\"]\n")
        print(f"Created Dockerfile for user_{i+1}_job_{j+1} at {dockerfile_path}")

# Fifth step: select the variables and pressure levels to download per user
# Each user can now handle multiple jobs (variable-pressure combinations)
# Count the total number of variable-pressure combinations
total_var_pressure = 0
for var in VARIABLES:
    pressure_levels = var['pressure_levels']
    total_var_pressure += len(pressure_levels)

total_workers = Number_of_Users * JOBS_PER_USER
if total_var_pressure > total_workers:
    print("\033[93mWarning: The number of variable-pressure combinations exceeds the available workers.\033[0m")
    print("\033[93mSome combinations will not be assigned to any worker.\033[0m")
    print(f"\033[93mTotal combinations: {total_var_pressure}, Total workers: {total_workers} ({Number_of_Users} users × {JOBS_PER_USER} jobs)\033[0m")

# Create a list of (variable_dict, pressure) combinations
var_pressure_combinations = []
for var in VARIABLES:
    pressure_levels = var['pressure_levels']
    for pressure in pressure_levels:
        var_pressure_combinations.append((var, pressure))

# Assign combinations to user-job workers
assignments = {}
worker_index = 0
for i in range(Number_of_Users):
    for j in range(JOBS_PER_USER):
        if worker_index < len(var_pressure_combinations):
            worker_key = f'user_{i+1}_job_{j+1}'
            assignments[worker_key] = var_pressure_combinations[worker_index]
            worker_index += 1

print("\nAssignments of variable-pressure to workers:")
for worker, assignment in assignments.items():
    var_dict, pressure = assignment
    print(f"{worker}: Variable = {var_dict['name']}, Pressure Level = {pressure}")

# Print a warning with the rest of combinations if exist
if len(var_pressure_combinations) > total_workers:
    print("\033[93mThe following variable-pressure combinations were not assigned to any worker:\033[0m")
    for var_dict, pressure in var_pressure_combinations[total_workers:]:
        print(f"\033[93mVariable = {var_dict['name']}, Pressure Level = {pressure}\033[0m")


# Sixth step: generate the download_era5.py file per worker
# Each worker gets assigned specific variable and pressure level from assignments
for i in range(Number_of_Users):
    for j in range(JOBS_PER_USER):
        worker_key = f'user_{i+1}_job_{j+1}'
        if worker_key in assignments:
            var_dict, assigned_pressure = assignments[worker_key]
            
            # Extract variable information from dictionary
            var_name = var_dict['name']
            dataset = DATASETS[var_dict['dataset_id'] - 1]
            start_year = var_dict['start_year']
            end_year = var_dict['end_year']
            region = var_dict['region']
            months = var_dict['months']
            days = var_dict['days']
            hours = var_dict['hours']
            
            # Convert region dict to area list [north, west, south, east]
            area = [region['north'], region['west'], region['south'], region['east']]
            
            # Format months, days, hours for the request
            months_str = str(months) if months != ['all'] else "['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']"
            days_str = str(days) if days != ['all'] else "['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']"
            hours_str = str(hours) if hours != ['all'] else "['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']"
            
            download_script_path = os.path.join(docker_path, f'user_{i+1}_job_{j+1}', 'download_era5.py')
            with open(download_script_path, 'w') as ds_file:
                ds_file.write("import os\n")
                ds_file.write("import cdsapi\n\n")
                ds_file.write(f"year_ini = {start_year}\n")
                ds_file.write(f"year_fin = {end_year}\n")
                ds_file.write(f"variable = \"{var_name}\"\n")
                ds_file.write(f"dataset = \"{dataset}\"\n")
                
                if assigned_pressure != 0:
                    ds_file.write(f"pressure_level = {assigned_pressure}\n")
                
                ds_file.write("\nperiodo = (int(year_ini), int(year_fin))\n\n")
                
                if assigned_pressure != 0:
                    ds_file.write("dir = f\"/data/{dataset}/{variable}/{pressure_level}/\"\n")
                else:
                    ds_file.write("dir = f\"/data/{dataset}/{variable}/\"\n")
                
                ds_file.write("anno = periodo[0]\n\n")
                ds_file.write("while anno <= periodo[1]:\n")
                ds_file.write("    filename = os.path.join(dir, f\"{anno}_{variable}.nc\")\n")
                ds_file.write("    target = filename\n")
                ds_file.write("    request = {\n")
                ds_file.write("        \"product_type\": [\"reanalysis\"],\n")
                ds_file.write("        \"variable\": [variable],\n")
                ds_file.write("        \"year\": [str(anno)],\n")
                ds_file.write(f"        \"month\": {months_str},\n")
                ds_file.write(f"        \"day\": {days_str},\n")
                ds_file.write(f"        \"time\": {hours_str},\n")
                
                if assigned_pressure != 0:
                    ds_file.write("        \"pressure_level\": [str(pressure_level)],\n")
                
                ds_file.write("        \"data_format\": \"netcdf\",\n")
                ds_file.write("        \"download_format\": \"unarchived\",\n")
                ds_file.write(f"        \"area\": {area}\n")
                ds_file.write("    }\n")
                ds_file.write("    anno += 1\n")
                ds_file.write("    client = cdsapi.Client(\n")
                ds_file.write(f"        url='{CDSAPI_URL}',\n")
                ds_file.write(f"        key='{API_KEYS[i]}'\n")
                ds_file.write("    )\n")
                ds_file.write("    client.retrieve(dataset, request, target)\n")
            
            print(f"\nCreated download_era5.py for {worker_key} at {download_script_path}")
            print(f"  API Key: user_{i+1}")
            print(f"  Assigned variable: {var_name}, pressure level: {assigned_pressure}")
            print(f"  Dataset: {dataset}")
            print(f"  Years: {start_year} - {end_year}")
            print(f"  Region: {area}")
            print(f"  Months: {len(months) if months != ['all'] else 'all (12)'}")
            print(f"  Days: {len(days) if days != ['all'] else 'all (31)'}")
            print(f"  Hours: {len(hours) if hours != ['all'] else 'all (24)'}")
