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
          [144.72794205710625, 13.492891940562632]]], null, false),
    sentinel = ee.ImageCollection("COPERNICUS/S2"),
    sites = ee.FeatureCollection("users/mitchest/guam_turbidity_sites");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// =============================================================================
// HYCOM Sea Temperature and Salinity Data Extraction for Guam
// =============================================================================
// This script extracts HYCOM sea temperature and salinity data at multiple 
// depths (0m, 2m, 4m, 6m, 8m, 10m) for the Apra Harbor area in Guam.
// Data is sampled at a point location and exported to Google Drive.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. DEFINE HYCOM COLLECTION
// -----------------------------------------------------------------------------
// Select HYCOM dataset and filter by location and date range
var HYCOM_guam_collection = ee.ImageCollection('HYCOM/sea_temp_salinity')
  .filter(ee.Filter.bounds(pt_ApraHarbor))           // Filter for Apra Harbor point
  .filter(ee.Filter.date('2010-03-01', '2020-07-31')) // Date range: 2010-2020
  .select(
    'water_temp_0', 'water_temp_2', 'water_temp_4',   // Water temperature at depths
    'water_temp_6', 'water_temp_8', 'water_temp_10', 
    'salinity_0', 'salinity_2', 'salinity_4',         // Salinity at depths
    'salinity_6', 'salinity_8', 'salinity_10'
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
var HYCOM_wt_salin_samples = HYCOM_guam_collection.map(sample_images).flatten();
print(HYCOM_wt_salin_samples.limit(300)); 

// -----------------------------------------------------------------------------
// 4. EXPORT TO GOOGLE DRIVE
// -----------------------------------------------------------------------------
Export.table.toDrive({
  collection: HYCOM_wt_salin_samples,
  description: 'guam_wt_salin_test',
  folder: 'guam_HYCOM',
  fileNamePrefix: 'guam_wt_salin_test',
  fileFormat: 'CSV'
});

// =============================================================================
// ARCHIVED CODE - Original examples and alternative approaches
// =============================================================================

/*
// -----------------------------------------------------------------------------
// SENTINEL-2 EXTRACTION (ORIGINAL CODE FOR REFERENCE)
// -----------------------------------------------------------------------------
function maskS2clouds(image) {
  // Bits 10 and 11 are clouds and cirrus, respectively, in Sentinel-2 imagery
  var cloudBitMask = ee.Number(2).pow(10).int();
  var cirrusBitMask = ee.Number(2).pow(11).int();
  var qa = image.select('QA60');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
            qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask);
}

var s2_collection = sentinel.filterBounds(extent).map(maskS2clouds).select([0,1,2,3,4,5,6,7,8]);

var sample_images = function(i) {
  return(i.sampleRegions({
    collection: sites,
    scale: 10,
    geometries: false
  }));
};

var s2_samples = s2_collection.map(sample_images).flatten();
print(s2_samples.limit(300));

Export.table.toDrive({
  collection: s2_samples,
  description: 'guam_s2_collection',
  folder: 'guam_turbidity',
  fileNamePrefix: 'guam_s2_collection',
  fileFormat: 'CSV'
});
*/

/*
// -----------------------------------------------------------------------------
// HYCOM VISUALIZATION EXAMPLE (ORIGINAL CODE)
// -----------------------------------------------------------------------------
var Guam_seaWaterTemperature = ee.ImageCollection('HYCOM/sea_temp_salinity')
  .filter(ee.Filter.bounds(pt_ApraHarbor))
  .filter(ee.Filter.date('2019-03-01', '2020-07-31'))
  .select('water_temp_0');

var visParams = {
  min: -20000.0,
  max: 15000.0,
  palette: ['000000', '005aff', '43c8c8', 'fff700', 'ff0000'],
};

Map.addLayer(Guam_seaWaterTemperature, visParams, 'Sea Water Temperature');
*/

/*
// -----------------------------------------------------------------------------
// EARTH ENGINE HYCOM EXAMPLE (ORIGINAL)
// -----------------------------------------------------------------------------
var dataset = ee.ImageCollection('HYCOM/sea_temp_salinity')
  .filter(ee.Filter.date('2018-08-01', '2018-08-15'));
var seaWaterTemperature = dataset.select('water_temp_0');
var visParams = {
  min: -20000.0,
  max: 15000.0,
  palette: ['000000', '005aff', '43c8c8', 'fff700', 'ff0000'],
};
Map.setCenter(-88.6, 26.4, 1);
Map.addLayer(seaWaterTemperature, visParams, 'Sea Water Temperature');
*/
