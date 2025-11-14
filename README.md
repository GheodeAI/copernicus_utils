# Copernicus Utils

A Python utility for downloading ERA5 climate data from the Copernicus Climate Data Store (CDS) using Docker containers with multiple API keys for parallel downloads.

## Overview

This tool automatically sets up Docker containers for downloading ERA5 reanalysis data from the Copernicus Climate Data Store. It supports multiple users/API keys for parallel downloads and handles both single-level and pressure-level variables.

## Features

- **Multi-user support**: Configure multiple API keys for parallel downloads
- **Docker containerization**: Each user gets their own container for isolated downloads
- **Flexible variable configuration**: Support for both single-level and pressure-level variables
- **Automatic directory structure**: Creates organized data directories
- **Region-specific downloads**: Configure custom geographical areas
- **Time range flexibility**: Set custom start and end years for each variable

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

Edit the `config.conf` file to set up your configuration:

#### API Keys
```ini
CDSAPI_KEY_1=your_first_api_key_here
CDSAPI_KEY_2=your_second_api_key_here
```

#### Variables
Configure variables using the format:
```ini
VARIABLE_<number>=<variable_name>,<pressure_levels>,<dataset_id>,<start_year>,<end_year>,<region>
```

**Examples:**
```ini
# Single-level variable (2m temperature)
VARIABLE_1=2m_temperature,0,1,1940,2024,90 -180 -90 180

# Pressure-level variable (wind components)
VARIABLE_2=u_component_of_wind,20 50 100,2,1950,2024,90 -180 -90 180
```

**Parameter explanations:**
- `variable_name`: ERA5 variable name (e.g., `2m_temperature`, `u_component_of_wind`)
- `pressure_levels`: Space-separated pressure levels in hPa, or `0` for single-level variables
- `dataset_id`: `1` for single-levels, `2` for pressure-levels
- `start_year`, `end_year`: Time range for download
- `region`: Bounding box as `North West South East` (e.g., `90 -180 -90 180` for global)

### 3. Run the Setup Script

Execute the main script to generate the Docker infrastructure:

```powershell
python Download_ERA5_docker.py
```

This script will:
- Parse your configuration
- Create the necessary directory structure
- Generate Docker containers for each user
- Create individual download scripts
- Assign variables to users automatically

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
├── config.conf                    # Configuration file
├── Download_ERA5_docker.py         # Main setup script
├── README.md                       # This file
├── data/                          # Downloaded data
│   └── reanalysis-era5-*/
│       └── variable_name/
│           └── [pressure_level/]   # Only for pressure-level variables
└── docker/                       # Docker infrastructure
    ├── docker-compose.yml         # Docker Compose file
    └── user_*/                    # Individual user containers
        ├── Dockerfile
        └── download_era5.py       # User-specific download script
```

## Downloaded Data Format

Data is organized as NetCDF files with the following naming convention:
- **Single-level variables**: `data/reanalysis-era5-single-levels/variable_name/YYYY_variable_name.nc`
- **Pressure-level variables**: `data/reanalysis-era5-pressure-levels/variable_name/pressure_level/YYYY_variable_name.nc`

Each file contains one year of hourly data for the specified variable and region.

## Configuration Parameters

### Datasets
- `DATASET_1=reanalysis-era5-single-levels` - Surface and single-level variables
- `DATASET_2=reanalysis-era5-pressure-levels` - Atmospheric pressure-level variables

### Common ERA5 Variables

**Single-level variables (use pressure level `0`):**
- `2m_temperature` - 2-meter air temperature
- `10m_u_component_of_wind` - 10-meter U wind component
- `10m_v_component_of_wind` - 10-meter V wind component
- `mean_sea_level_pressure` - Sea level pressure
- `total_precipitation` - Precipitation

**Pressure-level variables:**
- `temperature` - Air temperature at pressure levels
- `u_component_of_wind` - U wind component at pressure levels
- `v_component_of_wind` - V wind component at pressure levels
- `geopotential` - Geopotential height
- `relative_humidity` - Relative humidity

### Pressure Levels
Common pressure levels (in hPa): `1000 925 850 700 500 300 250 200 150 100 70 50 30 20 10`

## Monitoring Downloads

To check the status of your downloads:

```powershell
# View running containers
docker ps

# Check logs for a specific user
docker logs cdsapi_user_1

# Stop all downloads
docker-compose down
```

## Troubleshooting

### Common Issues

1. **API Key Issues**: Ensure your API keys are valid and you've accepted the ERA5 license terms
2. **Docker Issues**: Make sure Docker Desktop is running
3. **Disk Space**: ERA5 data files can be large; ensure sufficient disk space
4. **Variable Names**: Use exact ERA5 variable names as specified in the CDS documentation

### Performance Tips

- Use multiple API keys to parallelize downloads
- Consider downloading smaller time ranges or regions for testing
- Monitor your CDS quota to avoid hitting limits

## License

This project is for research and educational purposes. Please ensure compliance with Copernicus Climate Data Store terms of use.

## Contributing

Feel free to submit issues, suggestions, or pull requests to improve this utility.