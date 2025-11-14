import os

# First step: reed the config file to get the API keys and URL as variables
config_file = 'config.conf'
# Verify that the config file exists and read its content
if not os.path.isfile(config_file):
    raise FileNotFoundError(f"Configuration file '{config_file}' not found.")
# Read the config file to get the API keys and URL as variables
CDSAPI_URL = ''
API_KEYS = []
Number_of_Users = 0
with open(config_file, 'r') as file:
    for line in file:
        line = line.strip()
        if line.startswith('CDSAPI_URL='):
            CDSAPI_URL = line.split('=', 1)[1]
        elif line.startswith('CDSAPI_KEY_'):
            key = line.split('=', 1)[1]
            API_KEYS.append(key)
# Print the loaded configuration for verification
print(f"CDSAPI_URL: {CDSAPI_URL}")
Number_of_Users = len(API_KEYS)
print(f"Available API Keys (number_of_users: {Number_of_Users}):")
print(API_KEYS)

# Second step: reed the config file to get the dataset, and variables to download
DATASET = []
VARIABLES = []
with open(config_file, 'r') as file:
    for line in file:
        line = line.strip()
        if line.startswith('DATASET_'):
            dataset = line.split('=', 1)[1]
            DATASET.append(dataset)
        elif line.startswith('VARIABLE_'):
            vars_line = line.split('=', 1)[1]
            vars_list = [var.strip() for var in vars_line.split(',')]
            VARIABLES.append(vars_list)

print("Datasets to download:")
print(DATASET)
print("Variables to download:")
print(VARIABLES)


# Third step: generate all the folders and paths to download the data
# Loop through each dataset and its corresponding variables

actual_path = os.getcwd()

for var in VARIABLES:
    # Seelect the corresponding dataset
    dataset = DATASET[int(var[2])-1]
    # Check if pressure level is 0 (no pressure level)
    if int(var[1][0]) == 0:
        dir_path = f"data\{dataset}\{var[0]}"
        dir_path = os.path.join(actual_path, dir_path)
        os.makedirs(dir_path, exist_ok=True)
        print(f"Created directory: {dir_path}")
    else:
        pressures = var[1]
        # Convert pressures to list of strings if it's not already
        pressures = pressures.split()
        # Loop for all pressure levels if needed
        for pressure in pressures:
            dir_path = f"data\{dataset}\{var[0]}\{pressure}"
            dir_path = os.path.join(actual_path, dir_path)
            os.makedirs(dir_path, exist_ok=True)
            print(f"Created directory: {dir_path}")


# Fourth step: generete the docker structure
# Create docker directory
docker_path = os.path.join(actual_path, 'docker')
os.makedirs(docker_path, exist_ok=True)
# Create a directory for each user
for i in range(Number_of_Users):
    user_dir = os.path.join(docker_path, f'user_{i+1}')
    os.makedirs(user_dir, exist_ok=True)
    print(f"Created docker user directory: {user_dir}")

# Generate the docker-compose file
docker_compose_file = os.path.join(docker_path, 'docker-compose.yml')
with open(docker_compose_file, 'w') as dc_file:
    dc_file.write("services:\n")
    for i in range(Number_of_Users):
        dc_file.write(f"  user_{i+1}:\n")
        dc_file.write(f"    build:\n")
        dc_file.write(f"      context: ./user_{i+1}\n")
        dc_file.write(f"      dockerfile: Dockerfile\n")
        dc_file.write(f"    container_name: cdsapi_user_{i+1}\n")
        dc_file.write("    volumes:\n")
        dc_file.write(f"      - ../data:/data\n")
        dc_file.write("\n")

# Generate Dockerfile for each user
for i in range(Number_of_Users):
    dockerfile_path = os.path.join(docker_path, f'user_{i+1}', 'Dockerfile')
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
    print(f"Created Dockerfile for user_{i+1} at {dockerfile_path}")

# Fifth step: select the variables and pressure levels to download per user
# The max number of variables and pressures for each user is 1 variable and 1 pressure
# Count the total number of variable-pressure combinations
total_var_pressure = 0
for var in VARIABLES:
    pressures = var[1]
    pressures = pressures.split()
    total_var_pressure += len(pressures)
if total_var_pressure > Number_of_Users:
    print("\033[93mWarning: The number of variable-pressure combinations exceeds the number of users.\033[0m")
    print("\033[93mSome combinations will not be assigned to any user.\033[0m")
    print(f"\033[93mTotal combinations: {total_var_pressure}, Number of users: {Number_of_Users}\033[0m")
# Create a list of (variable, pressure) combinations
var_pressure_combinations = []
for var in VARIABLES:
    pressures = var[1]
    pressures = pressures.split()
    for pressure in pressures:
        var_pressure_combinations.append((var[0], pressure))
# Assign combinations to users
assignments = {}
for i in range(min(Number_of_Users, len(var_pressure_combinations))):
    assignments[f'user_{i+1}'] = var_pressure_combinations[i]
print("Assignments of variable-pressure to users:")
for user, assignment in assignments.items():
    print(f"{user}: Variable = {assignment[0]}, Pressure Level = {assignment[1]}")
# Print a warning with the rest of combinations if exist
if len(var_pressure_combinations) > Number_of_Users:
    print("\033[93mThe following variable-pressure combinations were not assigned to any user:\033[0m")
    for assignment in var_pressure_combinations[Number_of_Users:]:
        print(f"\033[93mVariable = {assignment[0]}, Pressure Level = {assignment[1]}\033[0m")


# Sixth step: generate the download_era5.py file per user
# Each user gets assigned specific variable and pressure level from assignments
for i in range(Number_of_Users):
    user_key = f'user_{i+1}'
    if user_key in assignments:
        assigned_var = assignments[user_key][0]
        assigned_pressure = assignments[user_key][1]
        # Search the variable selected in VARIABLES to get all the information
        var_info = None
        for var in VARIABLES:
            if var[0] == assigned_var:
                var_info = var
                break
        # Take area from var_info, and convert to list of floats
        area = [float(x) for x in var_info[5].split()]
        download_script_path = os.path.join(docker_path, f'user_{i+1}', 'download_era5.py')
        with open(download_script_path, 'w') as ds_file:
            ds_file.write("import os\n")
            ds_file.write("import cdsapi\n")
            ds_file.write(f"year_ini = {var_info[3]}\n")
            ds_file.write(f"year_fin = {var_info[4]}\n")
            ds_file.write(f"variable = \"{assigned_var}\"\n")
            ds_file.write(f"dataset = \"{DATASET[int(var_info[2])-1]}\"\n")
            if assigned_pressure != '0':
                 ds_file.write(f"pressure_level = {int(assigned_pressure)}\n")
            ds_file.write("\n")
            ds_file.write("periodo = (int(year_ini), int(year_fin))\n")
            ds_file.write("\n")
            if assigned_pressure != '0':
                ds_file.write("dir = f\"/data/{dataset}/{variable}/{pressure_level}/\"\n")
            else:
                ds_file.write("dir = f\"/data/{dataset}/{variable}/\"\n")
            ds_file.write("anno = periodo[0]\n")
            ds_file.write("\n")
            ds_file.write("while anno <= periodo[1]:\n")
            ds_file.write("    filename = os.path.join(dir, f\"{anno}_{variable}.nc\")\n")
            ds_file.write("    target = filename\n")
            ds_file.write("    request = {\n")
            ds_file.write("        \"product_type\": [\"reanalysis\"],\n")
            ds_file.write("        \"variable\": [variable],\n")
            ds_file.write("        \"year\": [str(anno)],\n")
            ds_file.write("        \"month\": [\n")
            ds_file.write("            \"01\", \"02\", \"03\",\n")
            ds_file.write("            \"04\", \"05\", \"06\",\n")
            ds_file.write("            \"07\", \"08\", \"09\",\n")
            ds_file.write("            \"10\", \"11\", \"12\"\n")
            ds_file.write("        ],\n")
            ds_file.write("        \"day\": [\n")
            ds_file.write("            \"01\", \"02\", \"03\",\n")
            ds_file.write("            \"04\", \"05\", \"06\",\n")
            ds_file.write("            \"07\", \"08\", \"09\",\n")
            ds_file.write("            \"10\", \"11\", \"12\",\n")
            ds_file.write("            \"13\", \"14\", \"15\",\n")
            ds_file.write("            \"16\", \"17\", \"18\",\n")
            ds_file.write("            \"19\", \"20\", \"21\",\n")
            ds_file.write("            \"22\", \"23\", \"24\",\n")
            ds_file.write("            \"25\", \"26\", \"27\",\n")
            ds_file.write("            \"28\", \"29\", \"30\",\n")
            ds_file.write("            \"31\"\n")
            ds_file.write("        ],\n")
            ds_file.write("        \"time\": [\n")
            ds_file.write("            \"00:00\", \"01:00\", \"02:00\",\n")
            ds_file.write("            \"03:00\", \"04:00\", \"05:00\",\n")
            ds_file.write("            \"06:00\", \"07:00\", \"08:00\",\n")
            ds_file.write("            \"09:00\", \"10:00\", \"11:00\",\n")
            ds_file.write("            \"12:00\", \"13:00\", \"14:00\",\n")
            ds_file.write("            \"15:00\", \"16:00\", \"17:00\",\n")
            ds_file.write("            \"18:00\", \"19:00\", \"20:00\",\n")
            ds_file.write("            \"21:00\", \"22:00\", \"23:00\"\n")
            ds_file.write("        ],\n")
            if assigned_pressure != '0':
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
            ds_file.write("    print(f\"Downloaded {target}\")\n")
        print(f"Created download_era5.py for user_{i+1} at {download_script_path}")
        print(f"  Assigned variable: {assigned_var}, pressure level: {assigned_pressure}")
