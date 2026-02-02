/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var pt_ApraHarbor = /* color: #d63000 */ee.Geometry.Point([144.65485229492185, 13.453549425080107]),
    extent = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[144.58477646872734, 13.492891940562632],
          [144.58477646872734, 13.383699190508409],
          [144.72794205710625, 13.383699190508409],
          [144.72794205710625, 13.492891940562632]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// =============================================================================
// HYCOM Sea Water Velocity Data Extraction for Guam
// =============================================================================
// This script extracts HYCOM sea water velocity data (both U and V components)
// at multiple depths (0m, 2m, 4m, 6m, 8m, 10m) for the Apra Harbor area in Guam.
// Data is sampled at a point location and exported to Google Drive.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. DEFINE HYCOM COLLECTION
// -----------------------------------------------------------------------------
// Select HYCOM water velocity dataset and filter by location and date range
var HYCOM_guam_collection_wv = ee.ImageCollection('HYCOM/sea_water_velocity')
  .filter(ee.Filter.bounds(pt_ApraHarbor))           // Filter for Apra Harbor point
  .filter(ee.Filter.date('2010-03-01', '2020-07-31')) // Date range: 2010-2020
  .select(
    'velocity_v_0', 'velocity_v_2', 'velocity_v_4',   // V-component (northward velocity)
    'velocity_v_6', 'velocity_v_8', 'velocity_v_10',
    'velocity_u_0', 'velocity_u_2', 'velocity_u_4',   // U-component (eastward velocity)
    'velocity_u_6', 'velocity_u_8', 'velocity_u_10'
  );

// -----------------------------------------------------------------------------
// 2. SAMPLE IMAGES FUNCTION
// -----------------------------------------------------------------------------
// Function to sample image values at the point location
// Note: Data is interpolated to 0.08 degree (8.88 km) lat/long grid
var sample_images = function(i) {
  return i.sampleRegions({
    collection: pt_ApraHarbor,  // Sample at Apra Harbor point
    scale: 10,                   // Sampling scale in meters
    geometries: false            // Don't include geometry in output
  });
};

// -----------------------------------------------------------------------------
// 3. APPLY SAMPLING AND PREVIEW RESULTS
// -----------------------------------------------------------------------------
var HYCOM_wv_samples = HYCOM_guam_collection_wv.map(sample_images).flatten();
print(HYCOM_wv_samples.limit(300));

// -----------------------------------------------------------------------------
// 4. EXPORT TO GOOGLE DRIVE
// -----------------------------------------------------------------------------
Export.table.toDrive({
  collection: HYCOM_wv_samples,
  description: 'guam_wv',
  folder: 'guam_HYCOM',
  fileNamePrefix: 'guam_wv',
  fileFormat: 'CSV'
});

// =============================================================================
// ARCHIVED CODE - Original Earth Engine example
// =============================================================================

/*
// -----------------------------------------------------------------------------
// EARTH ENGINE HYCOM WATER VELOCITY EXAMPLE (ORIGINAL)
// -----------------------------------------------------------------------------
var dataset = ee.ImageCollection('HYCOM/sea_water_velocity')
  .filter(ee.Filter.date('2018-08-01', '2018-08-15'));
var waterVelocityVis = {
  min: -1000.0,
  max: 4000.0,
  bands: ['velocity_u_0', 'velocity_v_0', 'velocity_v_0'],
};
Map.setCenter(-88.6, 26.4, 1);
Map.addLayer(dataset, waterVelocityVis, 'Water Velocity');
*/
