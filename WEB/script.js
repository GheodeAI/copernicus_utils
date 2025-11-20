// ===========================
// Global State Management
// ===========================
let apiKeysCount = 0;
let datasetsCount = 0;
let variablesCount = 0;

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    // Load default configuration
    loadDefaultConfig();
    updatePreview();
});

// ===========================
// Load Default Configuration
// ===========================
function loadDefaultConfig() {
    // No default configuration
}

// ===========================
// API Keys Management
// ===========================
function addApiKey(defaultKey = '') {
    apiKeysCount++;
    const container = document.getElementById('apiKeysContainer');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'api-key-item';
    itemDiv.id = `apiKey-${apiKeysCount}`;
    
    itemDiv.innerHTML = `
        <div class="item-header">
            <span class="item-title">👤 User ${apiKeysCount}</span>
            <button type="button" class="btn-remove" onclick="removeApiKey(${apiKeysCount})">
                ✕ Remove
            </button>
        </div>
        <div class="form-group">
            <label for="apiKeyValue-${apiKeysCount}">API Key:</label>
            <input type="text" 
                   id="apiKeyValue-${apiKeysCount}" 
                   value="${defaultKey}"
                   placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                   pattern="[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}">
            <small>Formato: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (UUID v4)</small>
        </div>
    `;
    
    container.appendChild(itemDiv);
    renumberApiKeys();
}

function removeApiKey(id) {
    const element = document.getElementById(`apiKey-${id}`);
    if (element) {
        element.remove();
        renumberApiKeys();
    }
}

function renumberApiKeys() {
    const apiKeyItems = document.querySelectorAll('.api-key-item');
    apiKeyItems.forEach((item, index) => {
        const titleSpan = item.querySelector('.item-title');
        if (titleSpan) {
            titleSpan.textContent = `👤 User ${index + 1}`;
        }
    });
}

// ===========================
// Datasets Management
// ===========================
function addDataset(defaultDataset = '') {
    datasetsCount++;
    const container = document.getElementById('datasetsContainer');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'dataset-item';
    itemDiv.id = `dataset-${datasetsCount}`;
    
    itemDiv.innerHTML = `
        <div class="item-header">
            <span class="item-title">📊 Dataset ${datasetsCount}</span>
            <button type="button" class="btn-remove" onclick="removeDataset(${datasetsCount})">
                ✕ Eliminar
            </button>
        </div>
        <div class="form-group">
            <label for="datasetValue-${datasetsCount}">Nombre del Dataset:</label>
            <select id="datasetValue-${datasetsCount}">
                <option value="reanalysis-era5-single-levels" ${defaultDataset === 'reanalysis-era5-single-levels' ? 'selected' : ''}>
                    ERA5 Single Levels (reanalysis-era5-single-levels)
                </option>
                <option value="reanalysis-era5-pressure-levels" ${defaultDataset === 'reanalysis-era5-pressure-levels' ? 'selected' : ''}>
                    ERA5 Pressure Levels (reanalysis-era5-pressure-levels)
                </option>
                <option value="reanalysis-era5-land" ${defaultDataset === 'reanalysis-era5-land' ? 'selected' : ''}>
                    ERA5 Land (reanalysis-era5-land)
                </option>
                <option value="reanalysis-era5-single-levels-monthly-means" ${defaultDataset === 'reanalysis-era5-single-levels-monthly-means' ? 'selected' : ''}>
                    ERA5 Monthly Single Levels (reanalysis-era5-single-levels-monthly-means)
                </option>
                <option value="reanalysis-era5-pressure-levels-monthly-means" ${defaultDataset === 'reanalysis-era5-pressure-levels-monthly-means' ? 'selected' : ''}>
                    ERA5 Monthly Pressure Levels (reanalysis-era5-pressure-levels-monthly-means)
                </option>
            </select>
            <small>Selecciona el dataset de ERA5 que deseas utilizar</small>
        </div>
    `;
    
    container.appendChild(itemDiv);
}

function removeDataset(id) {
    const element = document.getElementById(`dataset-${id}`);
    if (element) {
        element.remove();
    }
}

// ===========================
// Variables Database by Dataset
// ===========================
const variablesByDataset = {
    'reanalysis-era5-single-levels': [
        { value: '10m_u_component_of_wind', label: '10m u-component of wind' },
        { value: '10m_v_component_of_wind', label: '10m v-component of wind' },
        { value: '2m_dewpoint_temperature', label: '2m dewpoint temperature' },
        { value: '2m_temperature', label: '2m temperature' },
        { value: 'mean_sea_level_pressure', label: 'Mean sea level pressure' },
        { value: 'mean_wave_direction', label: 'Mean wave direction' },
        { value: 'mean_wave_period', label: 'Mean wave period' },
        { value: 'sea_surface_temperature', label: 'Sea surface temperature' },
        { value: 'significant_height_of_combined_wind_waves_and_swell', label: 'Significant height of combined wind waves and swell' },
        { value: 'surface_pressure', label: 'Surface pressure' },
        { value: 'total_precipitation', label: 'Total precipitation' },
        { value: '100m_u_component_of_wind', label: '100m u-component of wind' },
        { value: '100m_v_component_of_wind', label: '100m v-component of wind' },
        { value: '10m_u_component_of_neutral_wind', label: '10m u-component of neutral wind' },
        { value: '10m_v_component_of_neutral_wind', label: '10m v-component of neutral wind' },
        { value: '10m_wind_gust_since_previous_post_processing', label: '10m wind gust since previous post processing' },
        { value: 'air_density_over_the_oceans', label: 'Air density over the oceans' },
        { value: 'angle_of_sub_gridscale_orography', label: 'Angle of sub-gridscale orography' },
        { value: 'anisotropy_of_sub_gridscale_orography', label: 'Anisotropy of sub-gridscale orography' },
        { value: 'benjamin_feir_index', label: 'Benjamin-Feir index' },
        { value: 'boundary_layer_dissipation', label: 'Boundary layer dissipation' },
        { value: 'boundary_layer_height', label: 'Boundary layer height' },
        { value: 'charnock', label: 'Charnock' },
        { value: 'clear_sky_direct_solar_radiation_at_surface', label: 'Clear-sky direct solar radiation at surface' },
        { value: 'cloud_base_height', label: 'Cloud base height' },
        { value: 'coefficient_of_drag_with_waves', label: 'Coefficient of drag with waves' },
        { value: 'convective_available_potential_energy', label: 'Convective available potential energy' },
        { value: 'convective_inhibition', label: 'Convective inhibition' },
        { value: 'convective_precipitation', label: 'Convective precipitation' },
        { value: 'convective_rain_rate', label: 'Convective rain rate' },
        { value: 'convective_snowfall', label: 'Convective snowfall' },
        { value: 'convective_snowfall_rate_water_equivalent', label: 'Convective snowfall rate water equivalent' },
        { value: 'downward_uv_radiation_at_the_surface', label: 'Downward UV radiation at the surface' },
        { value: 'duct_base_height', label: 'Duct base height' },
        { value: 'eastward_gravity_wave_surface_stress', label: 'Eastward gravity wave surface stress' },
        { value: 'eastward_turbulent_surface_stress', label: 'Eastward turbulent surface stress' },
        { value: 'evaporation', label: 'Evaporation' },
        { value: 'forecast_albedo', label: 'Forecast albedo' },
        { value: 'forecast_logarithm_of_surface_roughness_for_heat', label: 'Forecast logarithm of surface roughness for heat' },
        { value: 'forecast_surface_roughness', label: 'Forecast surface roughness' },
        { value: 'free_convective_velocity_over_the_oceans', label: 'Free convective velocity over the oceans' },
        { value: 'friction_velocity', label: 'Friction velocity' },
        { value: 'geopotential', label: 'Geopotential' },
        { value: 'gravity_wave_dissipation', label: 'Gravity wave dissipation' },
        { value: 'high_cloud_cover', label: 'High cloud cover' },
        { value: 'high_vegetation_cover', label: 'High vegetation cover' },
        { value: 'ice_temperature_layer_1', label: 'Ice temperature layer 1' },
        { value: 'ice_temperature_layer_2', label: 'Ice temperature layer 2' },
        { value: 'ice_temperature_layer_3', label: 'Ice temperature layer 3' },
        { value: 'ice_temperature_layer_4', label: 'Ice temperature layer 4' },
        { value: 'instantaneous_10m_wind_gust', label: 'Instantaneous 10m wind gust' },
        { value: 'instantaneous_eastward_turbulent_surface_stress', label: 'Instantaneous eastward turbulent surface stress' },
        { value: 'instantaneous_large_scale_surface_precipitation_fraction', label: 'Instantaneous large-scale surface precipitation fraction' },
        { value: 'instantaneous_moisture_flux', label: 'Instantaneous moisture flux' },
        { value: 'instantaneous_northward_turbulent_surface_stress', label: 'Instantaneous northward turbulent surface stress' },
        { value: 'instantaneous_surface_sensible_heat_flux', label: 'Instantaneous surface sensible heat flux' },
        { value: 'k_index', label: 'K index' },
        { value: 'lake_bottom_temperature', label: 'Lake bottom temperature' },
        { value: 'lake_cover', label: 'Lake cover' },
        { value: 'lake_depth', label: 'Lake depth' },
        { value: 'lake_ice_depth', label: 'Lake ice depth' },
        { value: 'lake_ice_temperature', label: 'Lake ice temperature' },
        { value: 'lake_mix_layer_depth', label: 'Lake mix-layer depth' },
        { value: 'lake_mix_layer_temperature', label: 'Lake mix-layer temperature' },
        { value: 'lake_shape_factor', label: 'Lake shape factor' },
        { value: 'lake_total_layer_temperature', label: 'Lake total layer temperature' },
        { value: 'land_sea_mask', label: 'Land-sea mask' },
        { value: 'large_scale_precipitation', label: 'Large-scale precipitation' },
        { value: 'large_scale_precipitation_fraction', label: 'Large-scale precipitation fraction' },
        { value: 'large_scale_rain_rate', label: 'Large-scale rain rate' },
        { value: 'large_scale_snowfall', label: 'Large-scale snowfall' },
        { value: 'large_scale_snowfall_rate_water_equivalent', label: 'Large-scale snowfall rate water equivalent' },
        { value: 'leaf_area_index_high_vegetation', label: 'Leaf area index, high vegetation' },
        { value: 'leaf_area_index_low_vegetation', label: 'Leaf area index, low vegetation' },
        { value: 'low_cloud_cover', label: 'Low cloud cover' },
        { value: 'low_vegetation_cover', label: 'Low vegetation cover' },
        { value: 'maximum_2m_temperature_since_previous_post_processing', label: 'Maximum 2m temperature since previous post-processing' },
        { value: 'maximum_individual_wave_height', label: 'Maximum individual wave height' },
        { value: 'maximum_total_precipitation_rate_since_previous_post_processing', label: 'Maximum total precipitation rate since previous post-processing' },
        { value: 'mean_boundary_layer_dissipation', label: 'Mean boundary layer dissipation' },
        { value: 'mean_convective_precipitation_rate', label: 'Mean convective precipitation rate' },
        { value: 'mean_convective_snowfall_rate', label: 'Mean convective snowfall rate' },
        { value: 'mean_direction_of_total_swell', label: 'Mean direction of total swell' },
        { value: 'mean_direction_of_wind_waves', label: 'Mean direction of wind waves' },
        { value: 'mean_eastward_gravity_wave_surface_stress', label: 'Mean eastward gravity wave surface stress' },
        { value: 'mean_eastward_turbulent_surface_stress', label: 'Mean eastward turbulent surface stress' },
        { value: 'mean_evaporation_rate', label: 'Mean evaporation rate' },
        { value: 'mean_gravity_wave_dissipation', label: 'Mean gravity wave dissipation' },
        { value: 'mean_large_scale_precipitation_fraction', label: 'Mean large-scale precipitation fraction' },
        { value: 'mean_large_scale_precipitation_rate', label: 'Mean large-scale precipitation rate' },
        { value: 'mean_large_scale_snowfall_rate', label: 'Mean large-scale snowfall rate' },
        { value: 'mean_northward_gravity_wave_surface_stress', label: 'Mean northward gravity wave surface stress' },
        { value: 'mean_northward_turbulent_surface_stress', label: 'Mean northward turbulent surface stress' },
        { value: 'mean_period_of_total_swell', label: 'Mean period of total swell' },
        { value: 'mean_period_of_wind_waves', label: 'Mean period of wind waves' },
        { value: 'mean_potential_evaporation_rate', label: 'Mean potential evaporation rate' },
        { value: 'mean_runoff_rate', label: 'Mean runoff rate' },
        { value: 'mean_snow_evaporation_rate', label: 'Mean snow evaporation rate' },
        { value: 'mean_snowfall_rate', label: 'Mean snowfall rate' },
        { value: 'mean_snowmelt_rate', label: 'Mean snowmelt rate' },
        { value: 'mean_square_slope_of_waves', label: 'Mean square slope of waves' },
        { value: 'mean_sub_surface_runoff_rate', label: 'Mean sub-surface runoff rate' },
        { value: 'mean_surface_direct_short_wave_radiation_flux', label: 'Mean surface direct short-wave radiation flux' },
        { value: 'mean_surface_direct_short_wave_radiation_flux_clear_sky', label: 'Mean surface direct short-wave radiation flux, clear sky' },
        { value: 'mean_surface_downward_long_wave_radiation_flux', label: 'Mean surface downward long-wave radiation flux' },
        { value: 'mean_surface_downward_long_wave_radiation_flux_clear_sky', label: 'Mean surface downward long-wave radiation flux, clear sky' },
        { value: 'mean_surface_downward_short_wave_radiation_flux', label: 'Mean surface downward short-wave radiation flux' },
        { value: 'mean_surface_downward_short_wave_radiation_flux_clear_sky', label: 'Mean surface downward short-wave radiation flux, clear sky' },
        { value: 'mean_surface_downward_uv_radiation_flux', label: 'Mean surface downward UV radiation flux' },
        { value: 'mean_surface_latent_heat_flux', label: 'Mean surface latent heat flux' },
        { value: 'mean_surface_net_long_wave_radiation_flux', label: 'Mean surface net long-wave radiation flux' },
        { value: 'mean_surface_net_long_wave_radiation_flux_clear_sky', label: 'Mean surface net long-wave radiation flux, clear sky' },
        { value: 'mean_surface_net_short_wave_radiation_flux', label: 'Mean surface net short-wave radiation flux' },
        { value: 'mean_surface_net_short_wave_radiation_flux_clear_sky', label: 'Mean surface net short-wave radiation flux, clear sky' },
        { value: 'mean_surface_runoff_rate', label: 'Mean surface runoff rate' },
        { value: 'mean_surface_sensible_heat_flux', label: 'Mean surface sensible heat flux' },
        { value: 'mean_top_downward_short_wave_radiation_flux', label: 'Mean top downward short-wave radiation flux' },
        { value: 'mean_top_net_long_wave_radiation_flux', label: 'Mean top net long-wave radiation flux' },
        { value: 'mean_top_net_long_wave_radiation_flux_clear_sky', label: 'Mean top net long-wave radiation flux, clear sky' },
        { value: 'mean_top_net_short_wave_radiation_flux', label: 'Mean top net short-wave radiation flux' },
        { value: 'mean_top_net_short_wave_radiation_flux_clear_sky', label: 'Mean top net short-wave radiation flux, clear sky' },
        { value: 'mean_total_precipitation_rate', label: 'Mean total precipitation rate' },
        { value: 'mean_vertical_gradient_of_refractivity_inside_trapping_layer', label: 'Mean vertical gradient of refractivity inside trapping layer' },
        { value: 'mean_vertically_integrated_moisture_divergence', label: 'Mean vertically integrated moisture divergence' },
        { value: 'mean_wave_direction_of_first_swell_partition', label: 'Mean wave direction of first swell partition' },
        { value: 'mean_wave_direction_of_second_swell_partition', label: 'Mean wave direction of second swell partition' },
        { value: 'mean_wave_direction_of_third_swell_partition', label: 'Mean wave direction of third swell partition' },
        { value: 'mean_wave_period_based_on_first_moment', label: 'Mean wave period based on first moment' },
        { value: 'mean_wave_period_based_on_first_moment_for_swell', label: 'Mean wave period based on first moment for swell' },
        { value: 'mean_wave_period_based_on_first_moment_for_wind_waves', label: 'Mean wave period based on first moment for wind waves' },
        { value: 'mean_wave_period_based_on_second_moment_for_swell', label: 'Mean wave period based on second moment for swell' },
        { value: 'mean_wave_period_based_on_second_moment_for_wind_waves', label: 'Mean wave period based on second moment for wind waves' },
        { value: 'mean_wave_period_of_first_swell_partition', label: 'Mean wave period of first swell partition' },
        { value: 'mean_wave_period_of_second_swell_partition', label: 'Mean wave period of second swell partition' },
        { value: 'mean_wave_period_of_third_swell_partition', label: 'Mean wave period of third swell partition' },
        { value: 'mean_zero_crossing_wave_period', label: 'Mean zero-crossing wave period' },
        { value: 'medium_cloud_cover', label: 'Medium cloud cover' },
        { value: 'minimum_2m_temperature_since_previous_post_processing', label: 'Minimum 2m temperature since previous post-processing' },
        { value: 'minimum_total_precipitation_rate_since_previous_post_processing', label: 'Minimum total precipitation rate since previous post-processing' },
        { value: 'minimum_vertical_gradient_of_refractivity_inside_trapping_layer', label: 'Minimum vertical gradient of refractivity inside trapping layer' },
        { value: 'model_bathymetry', label: 'Model bathymetry' },
        { value: 'near_ir_albedo_for_diffuse_radiation', label: 'Near IR albedo for diffuse radiation' },
        { value: 'near_ir_albedo_for_direct_radiation', label: 'Near IR albedo for direct radiation' },
        { value: 'normalized_energy_flux_into_ocean', label: 'Normalized energy flux into ocean' },
        { value: 'normalized_energy_flux_into_waves', label: 'Normalized energy flux into waves' },
        { value: 'normalized_stress_into_ocean', label: 'Normalized stress into ocean' },
        { value: 'northward_gravity_wave_surface_stress', label: 'Northward gravity wave surface stress' },
        { value: 'northward_turbulent_surface_stress', label: 'Northward turbulent surface stress' },
        { value: 'ocean_surface_stress_equivalent_10m_neutral_wind_direction', label: 'Ocean surface stress equivalent 10m neutral wind direction' },
        { value: 'ocean_surface_stress_equivalent_10m_neutral_wind_speed', label: 'Ocean surface stress equivalent 10m neutral wind speed' },
        { value: 'peak_wave_period', label: 'Peak wave period' },
        { value: 'period_corresponding_to_maximum_individual_wave_height', label: 'Period corresponding to maximum individual wave height' },
        { value: 'potential_evaporation', label: 'Potential evaporation' },
        { value: 'precipitation_type', label: 'Precipitation type' },
        { value: 'runoff', label: 'Runoff' },
        { value: 'sea_ice_cover', label: 'Sea ice cover' },
        { value: 'significant_height_of_total_swell', label: 'Significant height of total swell' },
        { value: 'significant_height_of_wind_waves', label: 'Significant height of wind waves' },
        { value: 'significant_wave_height_of_first_swell_partition', label: 'Significant wave height of first swell partition' },
        { value: 'significant_wave_height_of_second_swell_partition', label: 'Significant wave height of second swell partition' },
        { value: 'significant_wave_height_of_third_swell_partition', label: 'Significant wave height of third swell partition' },
        { value: 'skin_reservoir_content', label: 'Skin reservoir content' },
        { value: 'skin_temperature', label: 'Skin temperature' },
        { value: 'slope_of_sub_gridscale_orography', label: 'Slope of sub-gridscale orography' },
        { value: 'snow_albedo', label: 'Snow albedo' },
        { value: 'snow_density', label: 'Snow density' },
        { value: 'snow_depth', label: 'Snow depth' },
        { value: 'snow_evaporation', label: 'Snow evaporation' },
        { value: 'snowfall', label: 'Snowfall' },
        { value: 'snowmelt', label: 'Snowmelt' },
        { value: 'soil_temperature_level_1', label: 'Soil temperature level 1' },
        { value: 'soil_temperature_level_2', label: 'Soil temperature level 2' },
        { value: 'soil_temperature_level_3', label: 'Soil temperature level 3' },
        { value: 'soil_temperature_level_4', label: 'Soil temperature level 4' },
        { value: 'soil_type', label: 'Soil type' },
        { value: 'standard_deviation_of_filtered_subgrid_orography', label: 'Standard deviation of filtered subgrid orography' },
        { value: 'standard_deviation_of_orography', label: 'Standard deviation of orography' },
        { value: 'sub_surface_runoff', label: 'Sub-surface runoff' },
        { value: 'surface_latent_heat_flux', label: 'Surface latent heat flux' },
        { value: 'surface_net_solar_radiation', label: 'Surface net solar radiation' },
        { value: 'surface_net_solar_radiation_clear_sky', label: 'Surface net solar radiation, clear sky' },
        { value: 'surface_net_thermal_radiation', label: 'Surface net thermal radiation' },
        { value: 'surface_net_thermal_radiation_clear_sky', label: 'Surface net thermal radiation, clear sky' },
        { value: 'surface_runoff', label: 'Surface runoff' },
        { value: 'surface_sensible_heat_flux', label: 'Surface sensible heat flux' },
        { value: 'surface_solar_radiation_downward_clear_sky', label: 'Surface solar radiation downward clear sky' },
        { value: 'surface_solar_radiation_downwards', label: 'Surface solar radiation downwards' },
        { value: 'surface_thermal_radiation_downward_clear_sky', label: 'Surface thermal radiation downward clear sky' },
        { value: 'surface_thermal_radiation_downwards', label: 'Surface thermal radiation downwards' },
        { value: 'temperature_of_snow_layer', label: 'Temperature of snow layer' },
        { value: 'toa_incident_solar_radiation', label: 'TOA incident solar radiation' },
        { value: 'top_net_solar_radiation', label: 'Top net solar radiation' },
        { value: 'top_net_solar_radiation_clear_sky', label: 'Top net solar radiation, clear sky' },
        { value: 'top_net_thermal_radiation', label: 'Top net thermal radiation' },
        { value: 'top_net_thermal_radiation_clear_sky', label: 'Top net thermal radiation, clear sky' },
        { value: 'total_cloud_cover', label: 'Total cloud cover' },
        { value: 'total_column_cloud_ice_water', label: 'Total column cloud ice water' },
        { value: 'total_column_cloud_liquid_water', label: 'Total column cloud liquid water' },
        { value: 'total_column_ozone', label: 'Total column ozone' },
        { value: 'total_column_rain_water', label: 'Total column rain water' },
        { value: 'total_column_snow_water', label: 'Total column snow water' },
        { value: 'total_column_supercooled_liquid_water', label: 'Total column supercooled liquid water' },
        { value: 'total_column_water', label: 'Total column water' },
        { value: 'total_column_water_vapour', label: 'Total column water vapour' },
        { value: 'total_sky_direct_solar_radiation_at_surface', label: 'Total sky direct solar radiation at surface' },
        { value: 'total_totals_index', label: 'Total totals index' },
        { value: 'trapping_layer_base_height', label: 'Trapping layer base height' },
        { value: 'trapping_layer_top_height', label: 'Trapping layer top height' },
        { value: 'type_of_high_vegetation', label: 'Type of high vegetation' },
        { value: 'type_of_low_vegetation', label: 'Type of low vegetation' },
        { value: 'u_component_stokes_drift', label: 'U-component stokes drift' },
        { value: 'uv_visible_albedo_for_diffuse_radiation', label: 'UV visible albedo for diffuse radiation' },
        { value: 'uv_visible_albedo_for_direct_radiation', label: 'UV visible albedo for direct radiation' },
        { value: 'v_component_stokes_drift', label: 'V-component stokes drift' },
        { value: 'vertical_integral_of_divergence_of_cloud_frozen_water_flux', label: 'Vertical integral of divergence of cloud frozen water flux' },
        { value: 'vertical_integral_of_divergence_of_cloud_liquid_water_flux', label: 'Vertical integral of divergence of cloud liquid water flux' },
        { value: 'vertical_integral_of_divergence_of_geopotential_flux', label: 'Vertical integral of divergence of geopotential flux' },
        { value: 'vertical_integral_of_divergence_of_kinetic_energy_flux', label: 'Vertical integral of divergence of kinetic energy flux' },
        { value: 'vertical_integral_of_divergence_of_mass_flux', label: 'Vertical integral of divergence of mass flux' },
        { value: 'vertical_integral_of_divergence_of_moisture_flux', label: 'Vertical integral of divergence of moisture flux' },
        { value: 'vertical_integral_of_divergence_of_ozone_flux', label: 'Vertical integral of divergence of ozone flux' },
        { value: 'vertical_integral_of_divergence_of_thermal_energy_flux', label: 'Vertical integral of divergence of thermal energy flux' },
        { value: 'vertical_integral_of_divergence_of_total_energy_flux', label: 'Vertical integral of divergence of total energy flux' },
        { value: 'vertical_integral_of_eastward_cloud_frozen_water_flux', label: 'Vertical integral of eastward cloud frozen water flux' },
        { value: 'vertical_integral_of_eastward_cloud_liquid_water_flux', label: 'Vertical integral of eastward cloud liquid water flux' },
        { value: 'vertical_integral_of_eastward_geopotential_flux', label: 'Vertical integral of eastward geopotential flux' },
        { value: 'vertical_integral_of_eastward_heat_flux', label: 'Vertical integral of eastward heat flux' },
        { value: 'vertical_integral_of_eastward_kinetic_energy_flux', label: 'Vertical integral of eastward kinetic energy flux' },
        { value: 'vertical_integral_of_eastward_mass_flux', label: 'Vertical integral of eastward mass flux' },
        { value: 'vertical_integral_of_eastward_ozone_flux', label: 'Vertical integral of eastward ozone flux' },
        { value: 'vertical_integral_of_eastward_total_energy_flux', label: 'Vertical integral of eastward total energy flux' },
        { value: 'vertical_integral_of_eastward_water_vapour_flux', label: 'Vertical integral of eastward water vapour flux' },
        { value: 'vertical_integral_of_energy_conversion', label: 'Vertical integral of energy conversion' },
        { value: 'vertical_integral_of_kinetic_energy', label: 'Vertical integral of kinetic energy' },
        { value: 'vertical_integral_of_mass_of_atmosphere', label: 'Vertical integral of mass of atmosphere' },
        { value: 'vertical_integral_of_mass_tendency', label: 'Vertical integral of mass tendency' },
        { value: 'vertical_integral_of_northward_cloud_frozen_water_flux', label: 'Vertical integral of northward cloud frozen water flux' },
        { value: 'vertical_integral_of_northward_cloud_liquid_water_flux', label: 'Vertical integral of northward cloud liquid water flux' },
        { value: 'vertical_integral_of_northward_geopotential_flux', label: 'Vertical integral of northward geopotential flux' },
        { value: 'vertical_integral_of_northward_heat_flux', label: 'Vertical integral of northward heat flux' },
        { value: 'vertical_integral_of_northward_kinetic_energy_flux', label: 'Vertical integral of northward kinetic energy flux' },
        { value: 'vertical_integral_of_northward_mass_flux', label: 'Vertical integral of northward mass flux' },
        { value: 'vertical_integral_of_northward_ozone_flux', label: 'Vertical integral of northward ozone flux' },
        { value: 'vertical_integral_of_northward_total_energy_flux', label: 'Vertical integral of northward total energy flux' },
        { value: 'vertical_integral_of_northward_water_vapour_flux', label: 'Vertical integral of northward water vapour flux' },
        { value: 'vertical_integral_of_potential_and_internal_energy', label: 'Vertical integral of potential and internal energy' },
        { value: 'vertical_integral_of_potential_internal_and_latent_energy', label: 'Vertical integral of potential, internal and latent energy' },
        { value: 'vertical_integral_of_temperature', label: 'Vertical integral of temperature' },
        { value: 'vertical_integral_of_thermal_energy', label: 'Vertical integral of thermal energy' },
        { value: 'vertical_integral_of_total_energy', label: 'Vertical integral of total energy' },
        { value: 'vertically_integrated_moisture_divergence', label: 'Vertically integrated moisture divergence' },
        { value: 'volumetric_soil_water_layer_1', label: 'Volumetric soil water layer 1' },
        { value: 'volumetric_soil_water_layer_2', label: 'Volumetric soil water layer 2' },
        { value: 'volumetric_soil_water_layer_3', label: 'Volumetric soil water layer 3' },
        { value: 'volumetric_soil_water_layer_4', label: 'Volumetric soil water layer 4' },
        { value: 'wave_spectral_directional_width', label: 'Wave spectral directional width' },
        { value: 'wave_spectral_directional_width_for_swell', label: 'Wave spectral directional width for swell' },
        { value: 'wave_spectral_directional_width_for_wind_waves', label: 'Wave spectral directional width for wind waves' },
        { value: 'wave_spectral_kurtosis', label: 'Wave spectral kurtosis' },
        { value: 'wave_spectral_peakedness', label: 'Wave spectral peakedness' },
        { value: 'wave_spectral_skewness', label: 'Wave spectral skewness' },
        { value: 'zero_degree_level', label: 'Zero degree level' }
    ],
    'reanalysis-era5-pressure-levels': [
        { value: 'divergence', label: 'Divergence' },
        { value: 'fraction_of_cloud_cover', label: 'Fraction of cloud cover' },
        { value: 'geopotential', label: 'Geopotential' },
        { value: 'ozone_mass_mixing_ratio', label: 'Ozone mass mixing ratio' },
        { value: 'potential_vorticity', label: 'Potential vorticity' },
        { value: 'relative_humidity', label: 'Relative humidity' },
        { value: 'specific_cloud_ice_water_content', label: 'Specific cloud ice water content' },
        { value: 'specific_cloud_liquid_water_content', label: 'Specific cloud liquid water content' },
        { value: 'specific_humidity', label: 'Specific humidity' },
        { value: 'specific_rain_water_content', label: 'Specific rain water content' },
        { value: 'specific_snow_water_content', label: 'Specific snow water content' },
        { value: 'temperature', label: 'Temperature' },
        { value: 'u_component_of_wind', label: 'U component of wind' },
        { value: 'v_component_of_wind', label: 'V component of wind' },
        { value: 'vertical_velocity', label: 'Vertical velocity' },
        { value: 'vorticity', label: 'Vorticity (relative)' }
    ],
    'reanalysis-era5-land': [
        { value: '2m_dewpoint_temperature', label: '2m dewpoint temperature' },
        { value: '2m_temperature', label: '2m temperature' },
        { value: 'skin_temperature', label: 'Skin temperature' },
        { value: 'soil_temperature_level_1', label: 'Soil temperature level 1' },
        { value: 'soil_temperature_level_2', label: 'Soil temperature level 2' },
        { value: 'soil_temperature_level_3', label: 'Soil temperature level 3' },
        { value: 'soil_temperature_level_4', label: 'Soil temperature level 4' },
        { value: 'lake_bottom_temperature', label: 'Lake bottom temperature' },
        { value: 'lake_ice_depth', label: 'Lake ice depth' },
        { value: 'lake_ice_temperature', label: 'Lake ice temperature' },
        { value: 'lake_mix_layer_depth', label: 'Lake mix-layer depth' },
        { value: 'lake_mix_layer_temperature', label: 'Lake mix-layer temperature' },
        { value: 'lake_shape_factor', label: 'Lake shape factor' },
        { value: 'lake_total_layer_temperature', label: 'Lake total layer temperature' },
        { value: 'snow_albedo', label: 'Snow albedo' },
        { value: 'snow_cover', label: 'Snow cover' },
        { value: 'snow_density', label: 'Snow density' },
        { value: 'snow_depth', label: 'Snow depth' },
        { value: 'snow_depth_water_equivalent', label: 'Snow depth water equivalent' },
        { value: 'snowfall', label: 'Snowfall' },
        { value: 'snowmelt', label: 'Snowmelt' },
        { value: 'temperature_of_snow_layer', label: 'Temperature of snow layer' },
        { value: 'skin_reservoir_content', label: 'Skin reservoir content' },
        { value: 'volumetric_soil_water_layer_1', label: 'Volumetric soil water layer 1' },
        { value: 'volumetric_soil_water_layer_2', label: 'Volumetric soil water layer 2' },
        { value: 'volumetric_soil_water_layer_3', label: 'Volumetric soil water layer 3' },
        { value: 'volumetric_soil_water_layer_4', label: 'Volumetric soil water layer 4' },
        { value: 'forecast_albedo', label: 'Forecast albedo' },
        { value: 'surface_latent_heat_flux', label: 'Surface latent heat flux' },
        { value: 'surface_net_solar_radiation', label: 'Surface net solar radiation' },
        { value: 'surface_net_thermal_radiation', label: 'Surface net thermal radiation' },
        { value: 'surface_sensible_heat_flux', label: 'Surface sensible heat flux' },
        { value: 'surface_solar_radiation_downwards', label: 'Surface solar radiation downwards' },
        { value: 'surface_thermal_radiation_downwards', label: 'Surface thermal radiation downwards' },
        { value: 'evaporation_from_bare_soil', label: 'Evaporation from bare soil' },
        { value: 'evaporation_from_open_water_surfaces_excluding_oceans', label: 'Evaporation from open water surfaces excluding oceans' },
        { value: 'evaporation_from_the_top_of_canopy', label: 'Evaporation from the top of canopy' },
        { value: 'evaporation_from_vegetation_transpiration', label: 'Evaporation from vegetation transpiration' },
        { value: 'potential_evaporation', label: 'Potential evaporation' },
        { value: 'runoff', label: 'Runoff' },
        { value: 'snow_evaporation', label: 'Snow evaporation' },
        { value: 'sub_surface_runoff', label: 'Sub-surface runoff' },
        { value: 'surface_runoff', label: 'Surface runoff' },
        { value: 'total_evaporation', label: 'Total evaporation' },
        { value: '10m_u_component_of_wind', label: '10m u-component of wind' },
        { value: '10m_v_component_of_wind', label: '10m v-component of wind' },
        { value: 'surface_pressure', label: 'Surface pressure' },
        { value: 'total_precipitation', label: 'Total precipitation' },
        { value: 'leaf_area_index_high_vegetation', label: 'Leaf area index, high vegetation' },
        { value: 'leaf_area_index_low_vegetation', label: 'Leaf area index, low vegetation' },
        { value: 'high_vegetation_cover', label: 'High vegetation cover' },
        { value: 'glacier_mask', label: 'Glacier mask' },
        { value: 'lake_cover', label: 'Lake cover' },
        { value: 'low_vegetation_cover', label: 'Low vegetation cover' },
        { value: 'lake_total_depth', label: 'Lake total depth' },
        { value: 'geopotential', label: 'Geopotential' },
        { value: 'land_sea_mask', label: 'Land-sea mask' },
        { value: 'soil_type', label: 'Soil type' },
        { value: 'type_of_high_vegetation', label: 'Type of high vegetation' },
        { value: 'type_of_low_vegetation', label: 'Type of low vegetation' }
    ]
};

const pressureLevels = ['1', '2', '3', '5', '7', '10', '20', '30', '50', '70', '100', '125', '150', '175', '200', '225', '250', '300', '350', '400', '450', '500', '550', '600', '650', '700', '750', '775', '800', '825', '850', '875', '900', '925', '950', '975', '1000'];

const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
];

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

// ===========================
// Variables Management
// ===========================
function addVariable(varName = '', pressureLevels = '0', periodicity = '1', startYear = '1940', endYear = '2024', region = '90 -180 -90 180') {
    variablesCount++;
    const container = document.getElementById('variablesContainer');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'variable-item';
    itemDiv.id = `variable-${variablesCount}`;
    
    itemDiv.innerHTML = `
        <div class="item-header">
            <span class="item-title">🌡️ Variable ${variablesCount}</span>
            <button type="button" class="btn-remove" onclick="removeVariable(${variablesCount})">
                ✕ Remove
            </button>
        </div>
        <div class="variable-grid">
            <div class="form-group">
                <label for="datasetSelect-${variablesCount}">Dataset:</label>
                <select id="datasetSelect-${variablesCount}" onchange="updateVariableOptions(${variablesCount})">
                    <option value="">Select dataset...</option>
                    <option value="reanalysis-era5-single-levels">ERA5 Single Levels</option>
                    <option value="reanalysis-era5-pressure-levels">ERA5 Pressure Levels</option>
                    <option value="reanalysis-era5-land">ERA5 Land</option>
                </select>
                <small>Select the dataset first</small>
            </div>
            <div class="form-group">
                <label for="varName-${variablesCount}">Variable:</label>
                <select id="varName-${variablesCount}" disabled onchange="handleVariableChange(${variablesCount})">
                    <option value="">First select a dataset</option>
                </select>
                <small>Meteorological variable to download</small>
            </div>
            <div class="form-group" id="pressureLevelsGroup-${variablesCount}" style="display: none;">
                <label for="pressureLevels-${variablesCount}">Pressure Levels (hPa): <span style="color: #dc3545;">*</span></label>
                <div class="pressure-selector" id="pressureSelector-${variablesCount}">
                    <button type="button" class="btn-pressure-toggle" onclick="toggleAllPressure(${variablesCount}, true)">All</button>
                    <button type="button" class="btn-pressure-toggle" onclick="toggleAllPressure(${variablesCount}, false)">None</button>
                    <div class="pressure-checkboxes" id="pressureCheckboxes-${variablesCount}"></div>
                </div>
                <small id="pressureLevelsHelp-${variablesCount}">⚠️ <strong>Required:</strong> Select at least one pressure level</small>
            </div>
            <div class="form-group">
                <label for="periodicity-${variablesCount}">Dataset ID:</label>
                <input type="number" 
                       id="periodicity-${variablesCount}" 
                       value="${periodicity}"
                       min="1"
                       readonly
                       style="background-color: #f0f0f0; cursor: not-allowed;"
                       placeholder="1">
                <small id="datasetIdInfo-${variablesCount}" style="color: #666;">Select a dataset to auto-assign ID</small>
            </div>
            <div class="form-group">
                <label for="startYear-${variablesCount}">Start Year:</label>
                <input type="number" 
                       id="startYear-${variablesCount}" 
                       value="${startYear}"
                       min="1940"
                       max="2025"
                       placeholder="1940"
                       onchange="validateYears(${variablesCount})"
                       onblur="validateYears(${variablesCount})">
                <small>Start year for download (1940-2025, Land: 1950-2025)</small>
            </div>
            <div class="form-group">
                <label for="endYear-${variablesCount}">End Year:</label>
                <input type="number" 
                       id="endYear-${variablesCount}" 
                       value="${endYear}"
                       min="1940"
                       max="2025"
                       placeholder="2025"
                       onchange="validateYears(${variablesCount})"
                       onblur="validateYears(${variablesCount})">
                <small>End year for download (1940-2025, Land: 1950-2025)</small>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label>Months: <span style="color: #dc3545;">*</span></label>
                <div class="time-selector" id="monthSelector-${variablesCount}">
                    <button type="button" class="btn-time-toggle" onclick="toggleAllTime(${variablesCount}, 'month', true)">All</button>
                    <button type="button" class="btn-time-toggle" onclick="toggleAllTime(${variablesCount}, 'month', false)">None</button>
                    <div class="time-checkboxes" id="monthCheckboxes-${variablesCount}"></div>
                </div>
                <small>⚠️ <strong>Required:</strong> Select at least one month</small>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label>Days: <span style="color: #dc3545;">*</span></label>
                <div class="time-selector" id="daySelector-${variablesCount}">
                    <button type="button" class="btn-time-toggle" onclick="toggleAllTime(${variablesCount}, 'day', true)">All</button>
                    <button type="button" class="btn-time-toggle" onclick="toggleAllTime(${variablesCount}, 'day', false)">None</button>
                    <div class="time-checkboxes" id="dayCheckboxes-${variablesCount}"></div>
                </div>
                <small>⚠️ <strong>Required:</strong> Select at least one day</small>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label>Hours (UTC): <span style="color: #dc3545;">*</span></label>
                <div class="time-selector" id="hourSelector-${variablesCount}">
                    <button type="button" class="btn-time-toggle" onclick="toggleAllTime(${variablesCount}, 'hour', true)">All</button>
                    <button type="button" class="btn-time-toggle" onclick="toggleAllTime(${variablesCount}, 'hour', false)">None</button>
                    <div class="time-checkboxes" id="hourCheckboxes-${variablesCount}"></div>
                </div>
                <small>⚠️ <strong>Required:</strong> Select at least one hour</small>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label>📍 Geographic Region:</label>
                <div class="region-selector">
                    <div class="region-inputs">
                        <div class="region-input-group">
                            <label for="regionNorth-${variablesCount}">North (Lat):</label>
                            <input type="number" 
                                   id="regionNorth-${variablesCount}" 
                                   value="90"
                                   min="-90"
                                   max="90"
                                   step="0.25"
                                   onchange="validateRegion(${variablesCount})"
                                   onblur="validateRegion(${variablesCount})">
                        </div>
                        <div class="region-input-group">
                            <label for="regionWest-${variablesCount}">West (Lon):</label>
                            <input type="number" 
                                   id="regionWest-${variablesCount}" 
                                   value="-180"
                                   min="-180"
                                   max="180"
                                   step="0.25"
                                   onchange="validateRegion(${variablesCount})"
                                   onblur="validateRegion(${variablesCount})">
                        </div>
                        <div class="region-input-group">
                            <label for="regionSouth-${variablesCount}">South (Lat):</label>
                            <input type="number" 
                                   id="regionSouth-${variablesCount}" 
                                   value="-90"
                                   min="-90"
                                   max="90"
                                   step="0.25"
                                   onchange="validateRegion(${variablesCount})"
                                   onblur="validateRegion(${variablesCount})">
                        </div>
                        <div class="region-input-group">
                            <label for="regionEast-${variablesCount}">East (Lon):</label>
                            <input type="number" 
                                   id="regionEast-${variablesCount}" 
                                   value="180"
                                   min="-180"
                                   max="180"
                                   step="0.25"
                                   onchange="validateRegion(${variablesCount})"
                                   onblur="validateRegion(${variablesCount})">
                        </div>
                    </div>
                    <div class="region-buttons">
                        <button type="button" class="btn-region-global" onclick="setGlobalRegion(${variablesCount})">
                            🌍 Global Coverage
                        </button>
                        <button type="button" class="btn-region-map" onclick="openMapSelector(${variablesCount})">
                            🗺️ Select on Map
                        </button>
                    </div>
                    <small>Coordinates in 0.25° increments • North/South: -90 to 90 • West/East: -180 to 180</small>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(itemDiv);
    
    // Initialize time checkboxes
    initializeTimeCheckboxes(variablesCount);
    
    // Parse and set region coordinates if provided
    if (region) {
        const regionParts = region.trim().split(/\s+/);
        if (regionParts.length >= 4) {
            document.getElementById(`regionNorth-${variablesCount}`).value = regionParts[0];
            document.getElementById(`regionWest-${variablesCount}`).value = regionParts[1];
            document.getElementById(`regionSouth-${variablesCount}`).value = regionParts[2];
            document.getElementById(`regionEast-${variablesCount}`).value = regionParts[3];
        }
    }
    
    // If loading existing variable, set it up
    if (varName) {
        loadExistingVariable(variablesCount, varName, pressureLevels, periodicity);
    }
    
    // Renumber all variables
    renumberVariables();
}

function updateVariableOptions(id) {
    const datasetSelect = document.getElementById(`datasetSelect-${id}`);
    const varSelect = document.getElementById(`varName-${id}`);
    const selectedDataset = datasetSelect.value;
    
    varSelect.innerHTML = '';
    
    if (!selectedDataset) {
        varSelect.disabled = true;
        varSelect.innerHTML = '<option value="">First select a dataset</option>';
        document.getElementById(`periodicity-${id}`).value = '';
        document.getElementById(`datasetIdInfo-${id}`).textContent = 'Select a dataset to auto-assign ID';
        document.getElementById(`datasetIdInfo-${id}`).style.color = '#666';
        return;
    }
    
    varSelect.disabled = false;
    varSelect.innerHTML = '<option value="">Select variable...</option>';
    
    const variables = variablesByDataset[selectedDataset] || [];
    variables.forEach(variable => {
        const option = document.createElement('option');
        option.value = variable.value;
        option.textContent = variable.label;
        option.dataset.requiresPressure = variable.requiresPressure;
        varSelect.appendChild(option);
    });
    
    // Auto-assign dataset ID based on current datasets
    updateDatasetId(id, selectedDataset);
}

function updateDatasetId(variableId, selectedDataset) {
    const datasets = getDatasets();
    let datasetId = datasets.indexOf(selectedDataset) + 1;
    
    // If dataset is not in the list yet (new), assign next available ID
    if (datasetId === 0) {
        datasetId = datasets.length + 1;
    }
    
    const periodicityInput = document.getElementById(`periodicity-${variableId}`);
    const infoElement = document.getElementById(`datasetIdInfo-${variableId}`);
    
    periodicityInput.value = datasetId;
    
    // Get dataset name for display
    const datasetName = selectedDataset.split('-').pop().toUpperCase();
    infoElement.textContent = `ID ${datasetId} assigned to ${datasetName}`;
    infoElement.style.color = '#28a745';
}

function handleVariableChange(id) {
    const datasetSelect = document.getElementById(`datasetSelect-${id}`);
    const selectedDataset = datasetSelect.value;
    const pressureGroup = document.getElementById(`pressureLevelsGroup-${id}`);
    
    // Show pressure levels only for pressure-levels dataset
    if (selectedDataset === 'reanalysis-era5-pressure-levels') {
        pressureGroup.style.display = 'block';
        initializePressureCheckboxes(id);
        
        // Add validation when checkboxes change
        setTimeout(() => {
            const checkboxes = document.querySelectorAll(`#pressureCheckboxes-${id} input[type="checkbox"]`);
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => validatePressureLevels(id));
            });
            // Validate initially
            validatePressureLevels(id);
        }, 100);
    } else {
        pressureGroup.style.display = 'none';
    }
}

function validatePressureLevels(id) {
    const datasetSelect = document.getElementById(`datasetSelect-${id}`);
    const selectedDataset = datasetSelect?.value;
    const pressureGroup = document.getElementById(`pressureLevelsGroup-${id}`);
    const helpText = document.getElementById(`pressureLevelsHelp-${id}`);
    
    if (selectedDataset !== 'reanalysis-era5-pressure-levels') {
        // Reset styles for non-pressure datasets
        if (pressureGroup) {
            pressureGroup.style.borderLeft = '';
            pressureGroup.style.backgroundColor = '';
        }
        if (helpText) {
            helpText.innerHTML = '⚠️ <strong>Required:</strong> Select at least one pressure level';
            helpText.style.color = '';
        }
        return true;
    }
    
    const checkedPressures = document.querySelectorAll(`#pressureCheckboxes-${id} input[type="checkbox"]:checked`);
    
    if (checkedPressures.length === 0) {
        // Add visual warning
        if (pressureGroup) {
            pressureGroup.style.borderLeft = '4px solid #dc3545';
            pressureGroup.style.backgroundColor = '#fff5f5';
        }
        if (helpText) {
            helpText.innerHTML = '❌ <strong style="color: #dc3545;">ERROR: You MUST select at least one pressure level!</strong>';
            helpText.style.color = '#dc3545';
            helpText.style.fontWeight = 'bold';
        }
        return false;
    } else {
        // Remove visual warning
        if (pressureGroup) {
            pressureGroup.style.borderLeft = '';
            pressureGroup.style.backgroundColor = '';
        }
        if (helpText) {
            helpText.innerHTML = '✓ <strong style="color: #28a745;">At least one pressure level selected</strong>';
            helpText.style.color = '#28a745';
            helpText.style.fontWeight = 'normal';
        }
        return true;
    }
}

function validateMonths(id) {
    const monthGroup = document.getElementById(`monthSelector-${id}`);
    const checkedMonths = document.querySelectorAll(`#monthCheckboxes-${id} input[type="checkbox"]:checked`);
    
    if (checkedMonths.length === 0) {
        // Add visual warning
        if (monthGroup) {
            monthGroup.style.borderLeft = '4px solid #dc3545';
            monthGroup.style.backgroundColor = '#fff5f5';
        }
        return false;
    } else {
        // Remove visual warning
        if (monthGroup) {
            monthGroup.style.borderLeft = '';
            monthGroup.style.backgroundColor = '';
        }
        return true;
    }
}

function validateDays(id) {
    const dayGroup = document.getElementById(`daySelector-${id}`);
    const checkedDays = document.querySelectorAll(`#dayCheckboxes-${id} input[type="checkbox"]:checked`);
    
    if (checkedDays.length === 0) {
        // Add visual warning
        if (dayGroup) {
            dayGroup.style.borderLeft = '4px solid #dc3545';
            dayGroup.style.backgroundColor = '#fff5f5';
        }
        return false;
    } else {
        // Remove visual warning
        if (dayGroup) {
            dayGroup.style.borderLeft = '';
            dayGroup.style.backgroundColor = '';
        }
        return true;
    }
}

function validateHours(id) {
    const hourGroup = document.getElementById(`hourSelector-${id}`);
    const checkedHours = document.querySelectorAll(`#hourCheckboxes-${id} input[type="checkbox"]:checked`);
    
    if (checkedHours.length === 0) {
        // Add visual warning
        if (hourGroup) {
            hourGroup.style.borderLeft = '4px solid #dc3545';
            hourGroup.style.backgroundColor = '#fff5f5';
        }
        return false;
    } else {
        // Remove visual warning
        if (hourGroup) {
            hourGroup.style.borderLeft = '';
            hourGroup.style.backgroundColor = '';
        }
        return true;
    }
}

function initializePressureCheckboxes(id) {
    const container = document.getElementById(`pressureCheckboxes-${id}`);
    if (container.children.length > 0) return; // Already initialized
    
    container.innerHTML = '';
    pressureLevels.forEach(level => {
        const label = document.createElement('label');
        label.className = 'pressure-checkbox-label';
        label.innerHTML = `
            <input type="checkbox" value="${level}" class="pressure-checkbox">
            <span>${level}</span>
        `;
        container.appendChild(label);
    });
}

function toggleAllPressure(id, selectAll) {
    const checkboxes = document.querySelectorAll(`#pressureCheckboxes-${id} input[type="checkbox"]`);
    checkboxes.forEach(cb => cb.checked = selectAll);
}

function initializeTimeCheckboxes(id) {
    // Initialize months
    const monthContainer = document.getElementById(`monthCheckboxes-${id}`);
    if (monthContainer) {
        monthContainer.innerHTML = '';
        months.forEach(month => {
            const label = document.createElement('label');
            label.className = 'time-checkbox-label';
            label.innerHTML = `
                <input type="checkbox" value="${month.value}" class="time-checkbox" checked>
                <span>${month.label}</span>
            `;
            monthContainer.appendChild(label);
        });
        
        // Add validation listeners
        const checkboxes = monthContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => validateMonths(id));
        });
        validateMonths(id);
    }
    
    // Initialize days
    const dayContainer = document.getElementById(`dayCheckboxes-${id}`);
    if (dayContainer) {
        dayContainer.innerHTML = '';
        days.forEach(day => {
            const label = document.createElement('label');
            label.className = 'time-checkbox-label';
            label.innerHTML = `
                <input type="checkbox" value="${day}" class="time-checkbox" checked>
                <span>${day}</span>
            `;
            dayContainer.appendChild(label);
        });
        
        // Add validation listeners
        const checkboxes = dayContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => validateDays(id));
        });
        validateDays(id);
    }
    
    // Initialize hours
    const hourContainer = document.getElementById(`hourCheckboxes-${id}`);
    if (hourContainer) {
        hourContainer.innerHTML = '';
        hours.forEach(hour => {
            const label = document.createElement('label');
            label.className = 'time-checkbox-label';
            label.innerHTML = `
                <input type="checkbox" value="${hour}" class="time-checkbox" checked>
                <span>${hour}</span>
            `;
            hourContainer.appendChild(label);
        });
        
        // Add validation listeners
        const checkboxes = hourContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => validateHours(id));
        });
        validateHours(id);
    }
}

function toggleAllTime(id, type, selectAll) {
    const checkboxes = document.querySelectorAll(`#${type}Checkboxes-${id} input[type="checkbox"]`);
    checkboxes.forEach(cb => cb.checked = selectAll);
    
    // Trigger validation
    if (type === 'month') validateMonths(id);
    else if (type === 'day') validateDays(id);
    else if (type === 'hour') validateHours(id);
}

function getSelectedMonths(id) {
    const checkboxes = document.querySelectorAll(`#monthCheckboxes-${id} input[type="checkbox"]:checked`);
    const selected = Array.from(checkboxes).map(cb => cb.value);
    return selected.length > 0 ? selected.join(' ') : 'all';
}

function getSelectedDays(id) {
    const checkboxes = document.querySelectorAll(`#dayCheckboxes-${id} input[type="checkbox"]:checked`);
    const selected = Array.from(checkboxes).map(cb => cb.value);
    return selected.length > 0 ? selected.join(' ') : 'all';
}

function getSelectedHours(id) {
    const checkboxes = document.querySelectorAll(`#hourCheckboxes-${id} input[type="checkbox"]:checked`);
    const selected = Array.from(checkboxes).map(cb => cb.value);
    return selected.length > 0 ? selected.join(' ') : 'all';
}

// ===========================
// Region Validation and Management
// ===========================
function validateRegion(id) {
    const northInput = document.getElementById(`regionNorth-${id}`);
    const westInput = document.getElementById(`regionWest-${id}`);
    const southInput = document.getElementById(`regionSouth-${id}`);
    const eastInput = document.getElementById(`regionEast-${id}`);
    
    if (!northInput || !westInput || !southInput || !eastInput) return;
    
    let north = parseFloat(northInput.value);
    let west = parseFloat(westInput.value);
    let south = parseFloat(southInput.value);
    let east = parseFloat(eastInput.value);
    
    let hasError = false;
    let errorMessage = '';
    
    // Round to nearest 0.25
    north = Math.round(north * 4) / 4;
    west = Math.round(west * 4) / 4;
    south = Math.round(south * 4) / 4;
    east = Math.round(east * 4) / 4;
    
    // Validate bounds
    if (isNaN(north) || north < -90 || north > 90) {
        northInput.style.borderColor = '#dc3545';
        hasError = true;
        errorMessage += '⚠️ North latitude must be between -90 and 90.\n';
    } else {
        northInput.value = north;
        northInput.style.borderColor = '';
    }
    
    if (isNaN(south) || south < -90 || south > 90) {
        southInput.style.borderColor = '#dc3545';
        hasError = true;
        errorMessage += '⚠️ South latitude must be between -90 and 90.\n';
    } else {
        southInput.value = south;
        southInput.style.borderColor = '';
    }
    
    if (isNaN(west) || west < -180 || west > 180) {
        westInput.style.borderColor = '#dc3545';
        hasError = true;
        errorMessage += '⚠️ West longitude must be between -180 and 180.\n';
    } else {
        westInput.value = west;
        westInput.style.borderColor = '';
    }
    
    if (isNaN(east) || east < -180 || east > 180) {
        eastInput.style.borderColor = '#dc3545';
        hasError = true;
        errorMessage += '⚠️ East longitude must be between -180 and 180.\n';
    } else {
        eastInput.value = east;
        eastInput.style.borderColor = '';
    }
    
    // Validate logical constraints
    if (!isNaN(north) && !isNaN(south) && south > north) {
        northInput.style.borderColor = '#dc3545';
        southInput.style.borderColor = '#dc3545';
        hasError = true;
        errorMessage += `⚠️ South latitude (${south}) cannot be greater than North latitude (${north}).\n`;
    }
    
    // Show error if any
    if (hasError && errorMessage) {
        alert(errorMessage);
        return false;
    }
    
    return true;
}

function setGlobalRegion(id) {
    document.getElementById(`regionNorth-${id}`).value = 90;
    document.getElementById(`regionWest-${id}`).value = -180;
    document.getElementById(`regionSouth-${id}`).value = -90;
    document.getElementById(`regionEast-${id}`).value = 180;
    validateRegion(id);
}

function getRegionString(id) {
    const north = document.getElementById(`regionNorth-${id}`)?.value || 90;
    const west = document.getElementById(`regionWest-${id}`)?.value || -180;
    const south = document.getElementById(`regionSouth-${id}`)?.value || -90;
    const east = document.getElementById(`regionEast-${id}`)?.value || 180;
    return `${north} ${west} ${south} ${east}`;
}

function loadTimeSelections(id, monthsStr, daysStr, hoursStr) {
    // Load months
    if (monthsStr && monthsStr !== 'all') {
        const selectedMonths = monthsStr.split(' ');
        const monthCheckboxes = document.querySelectorAll(`#monthCheckboxes-${id} input[type="checkbox"]`);
        monthCheckboxes.forEach(cb => {
            cb.checked = selectedMonths.includes(cb.value);
        });
    }
    
    // Load days
    if (daysStr && daysStr !== 'all') {
        const selectedDays = daysStr.split(' ');
        const dayCheckboxes = document.querySelectorAll(`#dayCheckboxes-${id} input[type="checkbox"]`);
        dayCheckboxes.forEach(cb => {
            cb.checked = selectedDays.includes(cb.value);
        });
    }
    
    // Load hours
    if (hoursStr && hoursStr !== 'all') {
        const selectedHours = hoursStr.split(' ');
        const hourCheckboxes = document.querySelectorAll(`#hourCheckboxes-${id} input[type="checkbox"]`);
        hourCheckboxes.forEach(cb => {
            cb.checked = selectedHours.includes(cb.value);
        });
    }
}

// ===========================
// Map Selector for Region
// ===========================
let mapInstance = null;
let currentRectangle = null;
let currentVariableId = null;
let isDrawing = false;
let startLatLng = null;
let mapMode = 'rectangle'; // 'rectangle' or 'point'
let currentRadius = 5.0;
let centerMarker = null;

function roundTo025(value) {
    return Math.round(value * 4) / 4;
}

function setMapMode(mode) {
    mapMode = mode;
    
    // Update button styles
    document.getElementById('rectangleMode').classList.toggle('active', mode === 'rectangle');
    document.getElementById('pointMode').classList.toggle('active', mode === 'point');
    
    // Update instructions
    document.getElementById('rectangleInstructions').style.display = mode === 'rectangle' ? 'block' : 'none';
    document.getElementById('pointInstructions').style.display = mode === 'point' ? 'block' : 'none';
    
    // Update cursor
    if (mapInstance) {
        mapInstance.getContainer().style.cursor = mode === 'rectangle' ? 'crosshair' : 'pointer';
    }
    
    // Clear current selection
    if (currentRectangle) {
        mapInstance.removeLayer(currentRectangle);
        currentRectangle = null;
    }
    if (centerMarker) {
        mapInstance.removeLayer(centerMarker);
        centerMarker = null;
    }
}

function updateRadius(value) {
    currentRadius = parseFloat(value);
    document.getElementById('radiusValue').textContent = currentRadius.toFixed(2);
    
    // If there's a center marker, update the rectangle
    if (centerMarker && mapMode === 'point') {
        const center = centerMarker.getLatLng();
        createRegionFromPoint(center, currentRadius);
    }
}

function createRegionFromPoint(center, radius) {
    const lat = center.lat;
    const lng = center.lng;
    
    // Calculate bounds
    let north = lat + radius;
    let south = lat - radius;
    let east = lng + radius;
    let west = lng - radius;
    
    // Clamp to valid ranges
    north = Math.min(90, north);
    south = Math.max(-90, south);
    east = Math.min(180, east);
    west = Math.max(-180, west);
    
    // Round to 0.25
    north = roundTo025(north);
    south = roundTo025(south);
    east = roundTo025(east);
    west = roundTo025(west);
    
    // Remove previous rectangle
    if (currentRectangle) {
        mapInstance.removeLayer(currentRectangle);
    }
    
    // Create new rectangle
    const bounds = L.latLngBounds(
        L.latLng(south, west),
        L.latLng(north, east)
    );
    
    currentRectangle = L.rectangle(bounds, {
        color: '#28a745',
        weight: 3,
        fillOpacity: 0.2,
        fillColor: '#28a745',
        dashArray: '5, 5'
    }).addTo(mapInstance);
    
    // Add popup with coordinates
    const popupContent = `
        <div style="font-size: 0.9rem;">
            <strong>📍 Region from Point</strong><br>
            <b>Center:</b> ${roundTo025(lat)}°, ${roundTo025(lng)}°<br>
            <b>Radius:</b> ${radius}°<br><br>
            <b>North:</b> ${north}°<br>
            <b>South:</b> ${south}°<br>
            <b>West:</b> ${west}°<br>
            <b>East:</b> ${east}°
        </div>
    `;
    currentRectangle.bindPopup(popupContent).openPopup();
}

function openMapSelector(id) {
    currentVariableId = id;
    const modal = document.getElementById('mapModal');
    modal.style.display = 'flex';
    
    // Initialize map if not already created
    setTimeout(() => {
        if (!mapInstance) {
            mapInstance = L.map('map', {
                center: [20, 0],
                zoom: 2,
                scrollWheelZoom: true,
                dragging: true
            });
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(mapInstance);
            
            // Disable default click behavior
            mapInstance.doubleClickZoom.disable();
            
            // Add custom drawing functionality with visual feedback
            let drawingLayer = L.layerGroup().addTo(mapInstance);
            
            mapInstance.on('mousedown', function(e) {
                if (e.originalEvent.button === 0) { // Left click only
                    if (mapMode === 'rectangle') {
                        startDrawing(e);
                    }
                }
            });
            
            mapInstance.on('mousemove', function(e) {
                if (mapMode === 'rectangle') {
                    updateDrawing(e);
                }
            });
            
            mapInstance.on('mouseup', function(e) {
                if (mapMode === 'rectangle') {
                    finishDrawing(e);
                }
            });
            
            mapInstance.on('click', function(e) {
                if (mapMode === 'point') {
                    handlePointClick(e);
                }
            });
            
            // Prevent text selection while dragging
            mapInstance.getContainer().style.cursor = 'crosshair';
        } else {
            mapInstance.invalidateSize();
            mapInstance.getContainer().style.cursor = mapMode === 'rectangle' ? 'crosshair' : 'pointer';
        }
        
        // Reset mode to rectangle
        setMapMode('rectangle');
        
        // Load current region if exists
        loadCurrentRegionOnMap(id);
    }, 100);
}

function handlePointClick(e) {
    const latlng = e.latlng;
    
    // Remove previous marker
    if (centerMarker) {
        mapInstance.removeLayer(centerMarker);
    }
    
    // Add new marker
    centerMarker = L.marker(latlng, {
        icon: L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjMjhhNzQ1IiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDkuNCAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIxLjkgMjUgMTIuNUMyNSA1LjYgMTkuNCA0IDEyLjUgMHptMCAxNy42Yy0yLjggMC01LTIuMi01LTVzMi4yLTUgNS01IDUgMi4yIDUgNS0yLjIgNS01IDV6Ii8+PC9zdmc+',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        })
    }).addTo(mapInstance);
    
    // Create region around point
    createRegionFromPoint(latlng, currentRadius);
}

function closeMapSelector() {
    const modal = document.getElementById('mapModal');
    modal.style.display = 'none';
    currentVariableId = null;
}

function startDrawing(e) {
    // Prevent map panning while drawing
    mapInstance.dragging.disable();
    
    isDrawing = true;
    startLatLng = e.latlng;
    
    // Remove previous temporary rectangle
    if (currentRectangle) {
        mapInstance.removeLayer(currentRectangle);
    }
    
    // Change cursor to indicate drawing
    mapInstance.getContainer().style.cursor = 'crosshair';
}

function updateDrawing(e) {
    if (!isDrawing || !startLatLng) return;
    
    const currentLatLng = e.latlng;
    
    // Remove previous rectangle
    if (currentRectangle) {
        mapInstance.removeLayer(currentRectangle);
    }
    
    // Create bounds
    const bounds = L.latLngBounds(startLatLng, currentLatLng);
    
    // Draw rectangle
    currentRectangle = L.rectangle(bounds, {
        color: '#0069b4',
        weight: 2,
        fillOpacity: 0.2
    }).addTo(mapInstance);
}

function finishDrawing(e) {
    if (!isDrawing) return;
    
    // Re-enable map dragging
    mapInstance.dragging.enable();
    mapInstance.getContainer().style.cursor = 'crosshair';
    
    isDrawing = false;
    startLatLng = null;
    
    if (currentRectangle) {
        const bounds = currentRectangle.getBounds();
        
        // Round to 0.25 increments
        const north = roundTo025(Math.max(bounds.getNorth(), bounds.getSouth()));
        const south = roundTo025(Math.min(bounds.getNorth(), bounds.getSouth()));
        const east = roundTo025(Math.max(bounds.getEast(), bounds.getWest()));
        const west = roundTo025(Math.min(bounds.getEast(), bounds.getWest()));
        
        // Update rectangle with rounded coordinates and better styling
        const roundedBounds = L.latLngBounds(
            L.latLng(south, west),
            L.latLng(north, east)
        );
        
        mapInstance.removeLayer(currentRectangle);
        currentRectangle = L.rectangle(roundedBounds, {
            color: '#0069b4',
            weight: 3,
            fillOpacity: 0.2,
            fillColor: '#0069b4',
            dashArray: '5, 5'
        }).addTo(mapInstance);
        
        // Add popup with coordinates
        const popupContent = `
            <div style="font-size: 0.9rem;">
                <strong>📍 Selected Region</strong><br>
                <b>North:</b> ${north}°<br>
                <b>South:</b> ${south}°<br>
                <b>West:</b> ${west}°<br>
                <b>East:</b> ${east}°
            </div>
        `;
        currentRectangle.bindPopup(popupContent).openPopup();
    }
}

function loadCurrentRegionOnMap(id) {
    const north = parseFloat(document.getElementById(`regionNorth-${id}`)?.value || 90);
    const west = parseFloat(document.getElementById(`regionWest-${id}`)?.value || -180);
    const south = parseFloat(document.getElementById(`regionSouth-${id}`)?.value || -90);
    const east = parseFloat(document.getElementById(`regionEast-${id}`)?.value || 180);
    
    // Remove previous rectangle
    if (currentRectangle) {
        mapInstance.removeLayer(currentRectangle);
    }
    
    // Draw current region
    const bounds = L.latLngBounds(
        L.latLng(south, west),
        L.latLng(north, east)
    );
    
    currentRectangle = L.rectangle(bounds, {
        color: '#0069b4',
        weight: 2,
        fillOpacity: 0.2
    }).addTo(mapInstance);
    
    // Fit map to bounds
    mapInstance.fitBounds(bounds);
}

function applyMapSelection() {
    if (!currentRectangle || !currentVariableId) return;
    
    const bounds = currentRectangle.getBounds();
    
    // Round to 0.25 increments
    const north = roundTo025(Math.max(bounds.getNorth(), bounds.getSouth()));
    const south = roundTo025(Math.min(bounds.getNorth(), bounds.getSouth()));
    const east = roundTo025(Math.max(bounds.getEast(), bounds.getWest()));
    const west = roundTo025(Math.min(bounds.getEast(), bounds.getWest()));
    
    // Clamp to valid ranges
    const clampedNorth = Math.max(-90, Math.min(90, north));
    const clampedSouth = Math.max(-90, Math.min(90, south));
    const clampedEast = Math.max(-180, Math.min(180, east));
    const clampedWest = Math.max(-180, Math.min(180, west));
    
    // Update input fields
    document.getElementById(`regionNorth-${currentVariableId}`).value = clampedNorth;
    document.getElementById(`regionSouth-${currentVariableId}`).value = clampedSouth;
    document.getElementById(`regionEast-${currentVariableId}`).value = clampedEast;
    document.getElementById(`regionWest-${currentVariableId}`).value = clampedWest;
    
    // Validate
    validateRegion(currentVariableId);
    
    // Close modal
    closeMapSelector();
}

function getSelectedPressureLevels(id) {
    const checkboxes = document.querySelectorAll(`#pressureCheckboxes-${id} input[type="checkbox"]:checked`);
    const levels = Array.from(checkboxes).map(cb => cb.value);
    return levels.length > 0 ? levels.join(' ') : '';
}

function loadExistingVariable(id, varName, pressureLevelsStr, periodicity) {
    // Try to determine dataset from variable name
    let foundDataset = null;
    for (const [dataset, variables] of Object.entries(variablesByDataset)) {
        if (variables.find(v => v.value === varName)) {
            foundDataset = dataset;
            break;
        }
    }
    
    if (foundDataset) {
        const datasetSelect = document.getElementById(`datasetSelect-${id}`);
        datasetSelect.value = foundDataset;
        updateVariableOptions(id);
        
        setTimeout(() => {
            const varSelect = document.getElementById(`varName-${id}`);
            varSelect.value = varName;
            handleVariableChange(id);
            
            // Update dataset ID to match current configuration
            updateDatasetId(id, foundDataset);
            
            // Set pressure levels if needed
            if (pressureLevelsStr !== '0') {
                setTimeout(() => {
                    const levels = pressureLevelsStr.split(' ');
                    const checkboxes = document.querySelectorAll(`#pressureCheckboxes-${id} input[type="checkbox"]`);
                    checkboxes.forEach(cb => {
                        if (levels.includes(cb.value)) {
                            cb.checked = true;
                        }
                    });
                }, 100);
            }
        }, 100);
    }
}

function removeVariable(id) {
    const element = document.getElementById(`variable-${id}`);
    if (element) {
        element.remove();
        renumberVariables();
    }
}

function renumberVariables() {
    const variableItems = document.querySelectorAll('.variable-item');
    variableItems.forEach((item, index) => {
        const titleSpan = item.querySelector('.item-title');
        if (titleSpan) {
            titleSpan.textContent = `🌡️ Variable ${index + 1}`;
        }
    });
}

// ===========================
// Dataset ID Validation
// ===========================
function validateDatasetIds() {
    const datasets = getDatasets();
    const variableItems = document.querySelectorAll('.variable-item');
    
    let errors = [];
    
    variableItems.forEach(item => {
        const id = item.id.split('-')[1];
        const datasetSelect = document.getElementById(`datasetSelect-${id}`);
        const periodicityInput = document.getElementById(`periodicity-${id}`);
        const varNameSelect = document.getElementById(`varName-${id}`);
        
        if (!datasetSelect || !periodicityInput || !varNameSelect) return;
        
        const selectedDataset = datasetSelect.value;
        const datasetId = parseInt(periodicityInput.value);
        const variableName = varNameSelect.value;
        
        if (!selectedDataset || !variableName) return;
        
        // Check if the dataset ID matches the position in the datasets array
        const expectedId = datasets.indexOf(selectedDataset) + 1;
        
        if (expectedId === 0) {
            errors.push(`Variable "${variableName}": Dataset "${selectedDataset}" not found in dataset list.`);
        } else if (datasetId !== expectedId) {
            errors.push(`Variable "${variableName}": Dataset ID mismatch. Expected ${expectedId} for "${selectedDataset}", but got ${datasetId}.`);
        }
        
        // Validate pressure levels for pressure-levels dataset
        if (selectedDataset === 'reanalysis-era5-pressure-levels') {
            const checkedPressures = document.querySelectorAll(`#pressureCheckboxes-${id} input[type="checkbox"]:checked`);
            if (checkedPressures.length === 0) {
                errors.push(`Variable "${variableName}": You must select at least one pressure level for pressure-levels dataset.`);
            }
        }
    });
    
    if (errors.length > 0) {
        alert('⚠️ Validation Errors:\n\n' + errors.join('\n\n') + '\n\nPlease check your variable configurations.');
        return false;
    }
    
    return true;
}

// ===========================
// Year Validation
// ===========================
function validateYears(id) {
    const startYearInput = document.getElementById(`startYear-${id}`);
    const endYearInput = document.getElementById(`endYear-${id}`);
    const datasetSelect = document.getElementById(`datasetSelect-${id}`);
    
    if (!startYearInput || !endYearInput) return;
    
    const startYear = parseInt(startYearInput.value);
    const endYear = parseInt(endYearInput.value);
    const currentYear = 2025;
    
    // Determine min year based on dataset
    const selectedDataset = datasetSelect?.value || '';
    const minYear = selectedDataset === 'reanalysis-era5-land' ? 1950 : 1940;
    
    let hasError = false;
    let errorMessage = '';
    
    // Validate start year
    if (isNaN(startYear) || startYear < minYear || startYear > currentYear) {
        startYearInput.style.borderColor = '#dc3545';
        hasError = true;
        errorMessage += `⚠️ Start year must be between ${minYear} and ${currentYear}.\n`;
    } else {
        startYearInput.style.borderColor = '';
    }
    
    // Validate end year
    if (isNaN(endYear) || endYear < minYear || endYear > currentYear) {
        endYearInput.style.borderColor = '#dc3545';
        hasError = true;
        errorMessage += `⚠️ End year must be between ${minYear} and ${currentYear}.\n`;
    } else {
        endYearInput.style.borderColor = '';
    }
    
    // Validate that end year is not before start year
    if (!isNaN(startYear) && !isNaN(endYear) && endYear < startYear) {
        startYearInput.style.borderColor = '#dc3545';
        endYearInput.style.borderColor = '#dc3545';
        hasError = true;
        errorMessage += `⚠️ End year (${endYear}) cannot be before start year (${startYear}).\n`;
    }
    
    // Show error if any
    if (hasError && errorMessage) {
        alert(errorMessage);
        return false;
    }
    
    return true;
}

// ===========================
// Config Generation
// ===========================
function generateConfigContent() {
    const apiUrl = document.getElementById('apiUrl').value.trim();
    
    let config = `CDSAPI_URL=${apiUrl}\n\n`;

    // API Keys
    const apiKeys = getApiKeys();
    apiKeys.forEach((key, index) => {
        config += `CDSAPI_KEY_${index + 1}=${key}\n`;
    });

    // Datasets
    config += `\n`;
    const datasets = getDatasets();
    datasets.forEach((dataset, index) => {
        config += `DATASET_${index + 1}=${dataset}\n`;
    });

    // Variables
    config += `\n`;

    const variables = getVariables();
    variables.forEach((variable, index) => {
        const regionParts = variable.region.split(' ');
        
        // Handle pressure levels
        let pressureLevels = '[0]';
        if (variable.pressureLevels && variable.pressureLevels !== '0' && variable.pressureLevels.trim() !== '') {
            const levels = variable.pressureLevels.split(' ').filter(l => l.trim() !== '');
            pressureLevels = levels.length > 0 ? `[${levels.join(', ')}]` : '[0]';
        }
        
        // Handle time parameters
        const months = variable.months === 'all' ? "['all']" : `[${variable.months.split(' ').map(m => `'${m}'`).join(', ')}]`;
        const days = variable.days === 'all' ? "['all']" : `[${variable.days.split(' ').map(d => `'${d}'`).join(', ')}]`;
        const hours = variable.hours === 'all' ? "['all']" : `[${variable.hours.split(' ').map(h => `'${h}'`).join(', ')}]`;
        
        config += `VARIABLE_${index + 1} = {\n`;
        config += `    'name': '${variable.name}',\n`;
        config += `    'pressure_levels': ${pressureLevels},\n`;
        config += `    'dataset_id': ${variable.periodicity},\n`;
        config += `    'start_year': ${variable.startYear},\n`;
        config += `    'end_year': ${variable.endYear},\n`;
        config += `    'region': {'north': ${regionParts[0]}, 'west': ${regionParts[1]}, 'south': ${regionParts[2]}, 'east': ${regionParts[3]}},\n`;
        config += `    'months': ${months},\n`;
        config += `    'days': ${days},\n`;
        config += `    'hours': ${hours}\n`;
        config += `}\n\n`;
    });

    return config;
}

// ===========================
// Data Collection Functions
// ===========================
function getApiKeysCount() {
    return document.querySelectorAll('.api-key-item').length;
}

function getApiKeys() {
    const keys = [];
    const apiKeyItems = document.querySelectorAll('.api-key-item');
    
    apiKeyItems.forEach(item => {
        const input = item.querySelector('input[type="text"]');
        if (input && input.value.trim()) {
            keys.push(input.value.trim());
        }
    });
    
    return keys;
}

function getDatasets() {
    const datasets = [];
    const datasetSet = new Set();
    
    // Extract unique datasets from variables
    const variableItems = document.querySelectorAll('.variable-item');
    variableItems.forEach(item => {
        const datasetSelect = item.querySelector('select[id^="datasetSelect-"]');
        if (datasetSelect && datasetSelect.value) {
            datasetSet.add(datasetSelect.value);
        }
    });
    
    return Array.from(datasetSet);
}

function getVariables() {
    const variables = [];
    const variableItems = document.querySelectorAll('.variable-item');
    
    variableItems.forEach(item => {
        const id = item.id.split('-')[1];
        const varSelect = item.querySelector(`select[id^="varName-"]`);
        const varName = varSelect?.value.trim();
        const datasetSelect = item.querySelector(`select[id^="datasetSelect-"]`);
        const selectedDataset = datasetSelect?.value || '';
        
        // Check if this is a pressure-levels dataset
        let pressureLevels = '0';
        if (selectedDataset === 'reanalysis-era5-pressure-levels') {
            pressureLevels = getSelectedPressureLevels(id);
        }
        
        const periodicity = item.querySelector('input[id^="periodicity-"]')?.value.trim();
        const startYear = item.querySelector('input[id^="startYear-"]')?.value.trim();
        const endYear = item.querySelector('input[id^="endYear-"]')?.value.trim();
        const region = getRegionString(id);
        const months = getSelectedMonths(id);
        const days = getSelectedDays(id);
        const hours = getSelectedHours(id);
        
        if (varName && periodicity && startYear && endYear) {
            variables.push({
                name: varName,
                pressureLevels: pressureLevels,
                periodicity: periodicity,
                startYear: startYear,
                endYear: endYear,
                region: region,
                months: months,
                days: days,
                hours: hours
            });
        }
    });
    
    return variables;
}

// ===========================
// Preview Update
// ===========================
function updatePreview() {
    const previewElement = document.getElementById('configPreview');
    const configContent = generateConfigContent();
    previewElement.textContent = configContent;
}

// ===========================
// Download Config File
// ===========================
function generateConfig() {
    // Validate data
    const apiKeys = getApiKeys();
    if (apiKeys.length === 0) {
        alert('⚠️ Please add at least one API key before generating the file.');
        return;
    }
    
    const datasets = getDatasets();
    if (datasets.length === 0) {
        alert('⚠️ Please add at least one variable before generating the file.');
        return;
    }
    
    const variables = getVariables();
    if (variables.length === 0) {
        alert('⚠️ Please add at least one variable before generating the file.');
        return;
    }
    
    // Validate dataset IDs
    if (!validateDatasetIds()) {
        return;
    }
    
    // Comprehensive validation for all variables
    const variableItems = document.querySelectorAll('.variable-item');
    let validationErrors = [];
    
    variableItems.forEach((item, index) => {
        const id = item.id.split('-')[1];
        const varNum = index + 1;
        
        // Validate years
        if (!validateYears(id)) {
            validationErrors.push(`Variable ${varNum}: Invalid year range`);
        }
        
        // Validate pressure levels (for pressure-level datasets)
        if (!validatePressureLevels(id)) {
            validationErrors.push(`Variable ${varNum}: Must select at least one pressure level`);
        }
        
        // Validate months
        if (!validateMonths(id)) {
            validationErrors.push(`Variable ${varNum}: Must select at least one month`);
        }
        
        // Validate days
        if (!validateDays(id)) {
            validationErrors.push(`Variable ${varNum}: Must select at least one day`);
        }
        
        // Validate hours
        if (!validateHours(id)) {
            validationErrors.push(`Variable ${varNum}: Must select at least one hour`);
        }
    });
    
    if (validationErrors.length > 0) {
        const errorMessage = '⚠️ Please fix the following errors before generating the file:\n\n' + 
                           validationErrors.join('\n');
        alert(errorMessage);
        return;
    }
    
    // Generate config content
    const configContent = generateConfigContent();
    
    // Create blob and download
    const blob = new Blob([configContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CONFIG.conf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ Archivo CONFIG.conf generado y descargado correctamente!');
}

// ===========================
// Load Existing Config
// ===========================
function loadExistingConfig() {
    document.getElementById('fileInput').click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseConfigFile(content);
    };
    reader.readAsText(file);
}

function parseConfigFile(content) {
    // Clear existing items
    document.getElementById('apiKeysContainer').innerHTML = '';
    document.getElementById('variablesContainer').innerHTML = '';
    
    // Reset counters
    apiKeysCount = 0;
    variablesCount = 0;
    
    const lines = content.split('\n');
    
    lines.forEach(line => {
        line = line.trim();
        
        // Skip comments and empty lines
        if (line.startsWith('#') || line === '') return;
        
        // Parse URL
        if (line.startsWith('CDSAPI_URL=')) {
            const url = line.split('=')[1].trim();
            document.getElementById('apiUrl').value = url;
        }
        
        // Parse API Keys
        if (line.startsWith('CDSAPI_KEY_')) {
            const key = line.split('=')[1].trim();
            addApiKey(key);
        }
        
        // Parse Variables (Python dictionary format)
        // Note: Datasets are now automatically extracted from variables
        if (line.startsWith('VARIABLE_') && line.includes('=') && line.includes('{')) {
            // Start collecting dictionary lines
            const varNumber = line.split('_')[1].split(' ')[0];
            let dictContent = '';
            let braceCount = 0;
            let currentLine = line;
            let lineIndex = lines.indexOf(line);
            
            // Collect all lines of the dictionary
            do {
                dictContent += currentLine + '\n';
                braceCount += (currentLine.match(/{/g) || []).length;
                braceCount -= (currentLine.match(/}/g) || []).length;
                lineIndex++;
                if (lineIndex < lines.length) {
                    currentLine = lines[lineIndex];
                }
            } while (braceCount > 0 && lineIndex < lines.length);
            
            // Parse the dictionary content
            try {
                const varName = dictContent.match(/'name':\s*'([^']+)'/)?.[1] || '';
                const pressureLevelsMatch = dictContent.match(/'pressure_levels':\s*\[([^\]]+)\]/)?.[1] || '0';
                const pressureLevels = pressureLevelsMatch.replace(/,/g, '').trim();
                const periodicity = dictContent.match(/'dataset_id':\s*(\d+)/)?.[1] || '1';
                const startYear = dictContent.match(/'start_year':\s*(\d+)/)?.[1] || '1940';
                const endYear = dictContent.match(/'end_year':\s*(\d+)/)?.[1] || '2024';
                
                // Parse region
                const north = dictContent.match(/'north':\s*(-?\d+\.?\d*)/)?.[1] || '90';
                const west = dictContent.match(/'west':\s*(-?\d+\.?\d*)/)?.[1] || '-180';
                const south = dictContent.match(/'south':\s*(-?\d+\.?\d*)/)?.[1] || '-90';
                const east = dictContent.match(/'east':\s*(-?\d+\.?\d*)/)?.[1] || '180';
                const region = `${north} ${west} ${south} ${east}`;
                
                // Parse time parameters
                const monthsMatch = dictContent.match(/'months':\s*\[([^\]]+)\]/)?.[1] || "'all'";
                const daysMatch = dictContent.match(/'days':\s*\[([^\]]+)\]/)?.[1] || "'all'";
                const hoursMatch = dictContent.match(/'hours':\s*\[([^\]]+)\]/)?.[1] || "'all'";
                
                const months = monthsMatch.replace(/'/g, '').replace(/,/g, '').trim();
                const days = daysMatch.replace(/'/g, '').replace(/,/g, '').trim();
                const hours = hoursMatch.replace(/'/g, '').replace(/,/g, '').trim();
                
                // Add variable
                const currentVarCount = variablesCount;
                addVariable(varName, pressureLevels, periodicity, startYear, endYear, region);
                
                // Load time selections
                setTimeout(() => {
                    loadTimeSelections(currentVarCount + 1, months, days, hours);
                }, 200);
            } catch (e) {
                console.error('Error parsing variable dictionary:', e);
            }
        }
    });
    
    updatePreview();
    alert('✅ Configuration loaded successfully from file!');
}

// ===========================
// Reset Form
// ===========================
function resetForm() {
    if (confirm('Are you sure you want to reset the form? All current data will be lost.')) {
        // Clear containers
        document.getElementById('apiKeysContainer').innerHTML = '';
        document.getElementById('variablesContainer').innerHTML = '';
        
        // Reset counters
        apiKeysCount = 0;
        variablesCount = 0;
        
        // Reset URL
        document.getElementById('apiUrl').value = 'https://cds.climate.copernicus.eu/api';
        
        // Load default config
        loadDefaultConfig();
        updatePreview();
        
        alert('✅ Form reset with default configuration.');
    }
}

// ===========================
// Common Variables Datalist
// ===========================
const commonVariablesHTML = `
<datalist id="commonVariables">
    <option value="2m_temperature">2m Temperature</option>
    <option value="total_precipitation">Total Precipitation</option>
    <option value="10m_u_component_of_wind">10m U-component of Wind</option>
    <option value="10m_v_component_of_wind">10m V-component of Wind</option>
    <option value="u_component_of_wind">U-component of Wind</option>
    <option value="v_component_of_wind">V-component of Wind</option>
    <option value="geopotential">Geopotential</option>
    <option value="relative_humidity">Relative Humidity</option>
    <option value="specific_humidity">Specific Humidity</option>
    <option value="surface_pressure">Surface Pressure</option>
    <option value="mean_sea_level_pressure">Mean Sea Level Pressure</option>
    <option value="total_cloud_cover">Total Cloud Cover</option>
    <option value="snow_depth">Snow Depth</option>
    <option value="sea_surface_temperature">Sea Surface Temperature</option>
    <option value="soil_temperature_level_1">Soil Temperature Level 1</option>
</datalist>
`;

// Add datalist to body on load
document.addEventListener('DOMContentLoaded', function() {
    document.body.insertAdjacentHTML('beforeend', commonVariablesHTML);
});
