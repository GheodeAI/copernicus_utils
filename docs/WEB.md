# WEB ERA5 Configuration Generator - Copernicus CDS

Web application to automatically generate `CONFIG.conf` configuration files for the Copernicus Climate Data Store API, with an intuitive graphical interface similar to the official ERA5 download interface.


## Features

- **Copernicus-style Interface** - Modern design with Earth space background
- **Dataset Selection** - ERA5 Single Levels, Pressure Levels, Land and monthly versions
- **275+ Single Level Variables** - All available ERA5 variables
- **16 Pressure Level Variables** - With selector for 37 pressure levels (1-1000 hPa)
- **Visual Pressure Selector** - Checkboxes to choose specific levels
- **Multi-user Management** - Add all the API keys you need
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
2. **API Keys**: 
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

1. Click "Update Preview" to see the result
2. Review the content in the preview section
3. Click "Download CONFIG.conf"
4. The file will download automatically

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

```conf
CDSAPI_URL=https://cds.climate.copernicus.eu/api

CDSAPI_KEY_1=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CDSAPI_KEY_2=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

DATASET_1=reanalysis-era5-single-levels
DATASET_2=reanalysis-era5-pressure-levels

VARIABLE_1=2m_temperature,0,1,1940,2024,90 -180 -90 180
VARIABLE_2=u_component_of_wind,20 50 100,2,1950,2024,90 -180 -90 180
```

## Security Notes

- API keys are sensitive: do not share them publicly
- The CONFIG.conf file should be kept secure
- Do not upload the file with your keys to public repositories

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