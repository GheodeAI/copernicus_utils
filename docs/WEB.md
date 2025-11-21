# WEB ERA5 Configuration Generator - Copernicus CDS

Web application to automatically generate `CONFIG.conf` configuration files for the Copernicus Climate Data Store API, with an intuitive graphical interface similar to the official ERA5 download interface.


## Features

- **Copernicus-style Interface** - Modern design with Earth space background
- **Dataset Selection** - ERA5 Single Levels, Pressure Levels, Land and monthly versions
- **275+ Single Level Variables** - All available ERA5 variables
- **16 Pressure Level Variables** - With selector for 37 pressure levels (1-1000 hPa)
- **Visual Pressure Selector** - Checkboxes to choose specific levels
- **Multi-user Management** - Add all the API keys you need
- **Multiple Jobs per User** - Configure simultaneous downloads per API key
- **Smart Validation** - Real-time warnings if you don't have enough workers for all combinations
- **Real-time Preview** - See the CONFIG.conf file before downloading
- **Load Existing Configurations** - Edit previous CONFIG.conf files
- **Automatic Validation** - Verifies data before generating
- **Responsive Design** - Works on desktop, tablet and mobile
- **100% Client-side** - No server needed, everything runs in the browser

## How to Use

### Open the Application

1. Open the `index.html` file in your web browser or go to https://GheodeAI.github.io/copernicus_utils
2. The application will load with a default configuration

### Configure API

1. **API URL**: Modify if necessary (default: `https://cds.climate.copernicus.eu/api`)
2. **Concurrent Jobs per User**: 
   - Set the number of simultaneous downloads per API key (default: 1)
   - Recommended: 1-3 jobs to avoid API throttling
   - Each job runs in a separate Docker container
   - Total workers = Number of API keys × Jobs per user
   - **Real-time indicator** shows if you have enough workers for all variable-pressure combinations
3. **API Keys**: 
   - Add users with the "➕ Add User" button
   - Enter API keys in UUID format
   - Remove unnecessary users with "✕ Remove"

### Configure Datasets

1. Add datasets with "➕ Add Dataset"
2. Select the ERA5 dataset type:
   - ERA5 Single Levels
   - ERA5 Pressure Levels
   - ERA5 Land
   - ERA5 Monthly (single/pressure levels)

### Configure Variables

1. Add variables with "➕ Add Variable"
2. **Select the dataset first** (Single Levels, Pressure Levels or Land)
3. **Choose the variable** from the dropdown menu:
   - **Single Levels**: 275+ variables (temperature, precipitation, wind, radiation, clouds, ocean, etc.)
   - **Pressure Levels**: 16 variables (temperature, wind, humidity, geopotential, etc.)
   - **Land**: 16 land surface-specific variables
4. **For Pressure Levels**: Select pressure levels with checkboxes
   - 37 available levels: 1, 2, 3, 5, 7, 10, 20, 30, 50... up to 1000 hPa
   - "All/None" buttons for quick selection
5. Complete additional fields:
   - **Dataset ID**: Dataset number in configuration (1, 2, 3...)
   - **Start/End Year**: Download time range (1940-2024)
   - **Region**: North West South East coordinates (e.g., `90 -180 -90 180` for global)

### Generate File

1. Click "🔄 Update Preview" to see the result
2. Review the content in the preview section
3. **Check for warnings**:
   - If you see a yellow warning box, you don't have enough workers
   - The warning shows how many combinations are unassigned
   - Solutions: add more API keys, increase jobs per user, or reduce variables
4. Click "💾 Download CONFIG.conf"
5. If there are insufficient workers, a confirmation dialog will appear
6. The file will download automatically

### Other Functions

- **Load Existing Configuration**: Load a previous CONFIG.conf file
- **Reset Form**: Return to default configuration

## File Structure

```
docs/
├── index.html      # Application HTML structure
├── styles.css      # CSS styles with modern design
├── script.js       # JavaScript logic for functionality
├── CONFIG.conf     # Configuration file (example)
└── README.md       # This file
```

## CONFIG.conf File Format

The generated file follows this structure:

```python
CDSAPI_URL=https://cds.climate.copernicus.eu/api

JOBS_PER_USER=2

CDSAPI_KEY_1=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CDSAPI_KEY_2=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

DATASET_1=reanalysis-era5-single-levels
DATASET_2=reanalysis-era5-pressure-levels

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
    'pressure_levels': [20, 50, 100],
    'dataset_id': 2,
    'start_year': 1950,
    'end_year': 2024,
    'region': {'north': 90, 'west': -180, 'south': -90, 'east': 180},
    'months': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    'days': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    'hours': ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
}
```

### Understanding Jobs per User

With `JOBS_PER_USER=2` and 2 API keys in the example above:
- **Total Workers**: 4 (2 API keys × 2 jobs each)
- **Variable 1**: 1 combination (single-level)
- **Variable 2**: 3 combinations (3 pressure levels)
- **Total Combinations**: 4
- **Result**: All combinations will be downloaded (4 workers for 4 combinations)

Docker containers will be named: `cdsapi_user_1_job_1`, `cdsapi_user_1_job_2`, `cdsapi_user_2_job_1`, `cdsapi_user_2_job_2`


## Security Notes

- API keys are sensitive: do not share them publicly
- The CONFIG.conf file should be kept secure
- Do not upload the file with your keys to public repositories
- Recommended: use 1-3 jobs per user to avoid API rate limiting

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