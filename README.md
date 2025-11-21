# Copernicus Utils (Hourly ERA5 Only)

A Python utility for downloading ERA5 climate data from the Copernicus Climate Data Store (CDS) using Docker containers with multiple API keys for parallel downloads.

## Overview

This tool automatically sets up Docker containers for downloading ERA5 reanalysis data from the Copernicus Climate Data Store. It supports multiple users/API keys for parallel downloads and handles both single-level and pressure-level variables with advanced configuration options.

## Features

- **Web Configuration Generator**: Graphical interface to create CONFIG.conf files easily
- **Multi-user support**: Configure multiple API keys for parallel downloads
- **Multiple jobs per user**: Each API key can handle multiple simultaneous downloads (configurable)
- **Docker containerization**: Each download runs in its own isolated container
- **Advanced variable configuration**: Python dictionary format with full control over temporal and spatial parameters
- **Automatic directory structure**: Creates organized data directories
- **Region-specific downloads**: Configure custom geographical areas with precise coordinates
- **Flexible temporal selection**: Customize years, months, days, and hours for each variable
- **275+ ERA5 variables**: Full support for single-level, pressure-level, and land variables

## Prerequisites

- Python 3.x
- Docker Desktop
- Copernicus Climate Data Store account(s) with API key(s)

## Setup

### 1. Get API Keys

1. Register at [Copernicus Climate Data Store](https://cds.climate.copernicus.eu/)
2. Go to your profile page to get your API key
3. Accept the terms and conditions for ERA5 datasets

### 2. Configure the Project

You have two options to create your configuration file:

#### Option A: Use the Web Interface (Recommended)

1. Open `docs/index.html` in your web browser or this link https://GheodeAI.github.io/copernicus_utils
2. Configure your API keys, datasets, and variables using the graphical interface
3. Download the generated `CONFIG.conf` file
4. Place it in the root directory of the project

See the [Web Interface Documentation](docs/WEB.md) for detailed instructions.

#### Option B: Manually Edit CONFIG.conf

Edit the `CONFIG.conf` file to set up your configuration:

#### Concurrent Jobs per User
```python
JOBS_PER_USER=1
```
This parameter controls how many simultaneous downloads (variable-pressure combinations) each API key can handle. 
- **Default: 1** - One download per API key
- **Recommended: 1-3** - To avoid API throttling
- Each job runs in a separate Docker container
- Total concurrent downloads = Number of API keys × Jobs per user

#### API Keys
```python
CDSAPI_KEY_1=your-unique-api-key-here
CDSAPI_KEY_2=your-unique-api-key-here
CDSAPI_KEY_3=your-unique-api-key-here
```

#### Datasets
```python
DATASET_1=reanalysis-era5-single-levels
DATASET_2=reanalysis-era5-pressure-levels
```

#### Variables (Python Dictionary Format)
Configure variables using Python dictionary format for maximum flexibility:

```python
VARIABLE_1 = {
    'name': 'mean_sea_level_pressure',
    'pressure_levels': [0],
    'dataset_id': 1,
    'start_year': 1940,
    'end_year': 2024,
    'region': {'north': 90, 'west': -180, 'south': -90, 'east': 180},
    'months': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    'days': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    'hours': ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
}

VARIABLE_2 = {
    'name': 'temperature',
    'pressure_levels': [1, 2, 3, 5, 10, 20, 50, 100],
    'dataset_id': 2,
    'start_year': 1940,
    'end_year': 2024,
    'region': {'north': 40.75, 'west': -3.75, 'south': 40.25, 'east': -3.25},
    'months': ['01', '06', '12'],  # Only specific months
    'days': ['01', '15'],           # Only specific days
    'hours': ['00:00', '12:00']     # Only specific hours
}
```

**Parameter explanations:**
- `name`: ERA5 variable name (e.g., `mean_sea_level_pressure`, `temperature`)
- `pressure_levels`: List of pressure levels in hPa, or `[0]` for single-level variables
- `dataset_id`: corresponding dataset number of the assigned dataset, in this case
  - `1` for single-levels, `2` for pressure-levels
- `start_year`, `end_year`: Time range for download
- `region`: Dictionary with `north`, `west`, `south`, `east` coordinates
- `months`: List of months to download (01-12)
- `days`: List of days to download (01-31)
- `hours`: List of hours to download in HH:MM format

### 3. Run the Setup Script

Execute the main script to generate the Docker infrastructure:

```powershell
python Download_ERA5_docker.py
```

This script will:
- Parse your `CONFIG.conf` file
- Validate all variable configurations
- Create the necessary directory structure
- Generate Docker containers for each user
- Create individual download scripts with your specific parameters
- Assign variables and pressure levels to users automatically, and determine if the same variable/pressure will not be downloaded.
- Display a summary of all assignments and configurations

### 4. Start the Downloads

Navigate to the docker directory and start the containers:

```powershell
cd docker
docker-compose up -d --build
```

## Project Structure

After running the setup script, your project will have the following structure:

```
copernicus_utils/
├── CONFIG.conf                     # Configuration file
├── Download_ERA5_docker.py         # Main setup script
├── README.md                       # This file
├── docs/                           # Web configuration generator
│   ├── index.html                  # Web interface
│   ├── script.js                   # JavaScript logic
│   ├── styles.css                  # Styling
│   └── WEB.md                      # Web documentation
├── data/                           # Downloaded data
│   └── reanalysis-era5-*/
│       └── variable_name/
│           └── [pressure_level/]   # Only for pressure-level variables
└── docker/                         # Docker infrastructure
    ├── docker-compose.yml          # Docker Compose file
    └── user_*/                     # Individual user containers
        ├── Dockerfile
        └── download_era5.py        # User-specific download script
```

## Downloaded Data Format

Data is organized as NetCDF files with the following naming convention:
- **Single-level variables**: `data/reanalysis-era5-single-levels/variable_name/YYYY_variable_name.nc`
- **Pressure-level variables**: `data/reanalysis-era5-pressure-levels/variable_name/pressure_level/YYYY_variable_name.nc`

Each file contains one year of hourly data for the specified variable and region.

## Configuration Parameters

### Available Datasets
- `reanalysis-era5-single-levels` - Surface and single-level variables (275+ variables)
- `reanalysis-era5-pressure-levels` - Atmospheric pressure-level variables (16 variables)
- `reanalysis-era5-land` - Land surface variables
- `reanalysis-era5-single-levels-monthly-means` - Monthly averaged single-level data
- `reanalysis-era5-pressure-levels-monthly-means` - Monthly averaged pressure-level data

### Common ERA5 Variables

**Single-level variables (use pressure_levels: [0]):**
- `2m_temperature` - 2-meter air temperature
- `10m_u_component_of_wind` - 10-meter U wind component
- `10m_v_component_of_wind` - 10-meter V wind component
- `mean_sea_level_pressure` - Sea level pressure
- `total_precipitation` - Total precipitation
- `surface_pressure` - Surface pressure
- `2m_dewpoint_temperature` - 2-meter dewpoint temperature
- `skin_temperature` - Skin temperature
- Plus 267 more variables available in the web interface

**Pressure-level variables:**
- `temperature` - Air temperature at pressure levels
- `u_component_of_wind` - U wind component at pressure levels
- `v_component_of_wind` - V wind component at pressure levels
- `geopotential` - Geopotential height
- `relative_humidity` - Relative humidity
- `specific_humidity` - Specific humidity
- `vertical_velocity` - Vertical velocity (omega)
- `vorticity` - Vorticity (relative)
- `divergence` - Divergence
- Plus 7 more variables

### Pressure Levels
Available pressure levels (in hPa): 
`1, 2, 3, 5, 7, 10, 20, 30, 50, 70, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 775, 800, 825, 850, 875, 900, 925, 950, 975, 1000`

### Temporal Parameters

You can now customize:
- **Months**: Select specific months (e.g., only summer months: `['06', '07', '08']`)
- **Days**: Select specific days (e.g., every 15th: `['15']`)
- **Hours**: Select specific hours (e.g., synoptic hours: `['00:00', '06:00', '12:00', '18:00']`)

This allows you to:
- Download only the data you need
- Reduce download time and storage requirements
- Focus on specific temporal patterns or events

## Monitoring Downloads

To check the status of your downloads:

```powershell
# View running containers
docker ps

# Check logs for a specific worker (user_job combination)
docker logs cdsapi_user_1_job_1
docker logs cdsapi_user_2_job_1

# Check logs for all containers of a user
docker ps --filter "name=cdsapi_user_1" --format "{{.Names}}" | ForEach-Object { docker logs $_ --tail 50 }

# Stop all downloads
cd docker
docker-compose down
```

## Understanding the Container Naming

With the `JOBS_PER_USER` parameter, containers are named as `cdsapi_user_X_job_Y`:
- `X` = User/API key number (1, 2, 3...)
- `Y` = Job number for that user (1, 2, 3...)

**Example with 2 users and 2 jobs per user:**
- `cdsapi_user_1_job_1` - First job using API key 1
- `cdsapi_user_1_job_2` - Second job using API key 1
- `cdsapi_user_2_job_1` - First job using API key 2
- `cdsapi_user_2_job_2` - Second job using API key 2

This allows 4 simultaneous downloads using only 2 API keys!

## License

This project is for research and educational purposes. Please ensure compliance with Copernicus Climate Data Store terms of use.

## Contributing

Feel free to submit issues, suggestions, or pull requests to improve this utility.

## Links

- [Copernicus Climate Data Store](https://cds.climate.copernicus.eu/)
- [ERA5 Documentation](https://confluence.ecmwf.int/display/CKB/ERA5)
- [ERA5 Variable List](https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels)
- [CDS API Documentation](https://cds.climate.copernicus.eu/api-how-to)

---

**Developed by GheodeAI** | [GitHub Repository](https://github.com/GheodeAI/copernicus_utils)