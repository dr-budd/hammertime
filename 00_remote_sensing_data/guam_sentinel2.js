/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var extent = 
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
// Sentinel-2 Data Extraction for Guam Turbidity Estimation
// =============================================================================
// This script extracts Sentinel-2 imagery for turbidity estimation at monitoring sites.
// Cloud masking is applied to ensure clear conditions.
// Data is sampled at turbidity monitoring sites and exported to Google Drive.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. DEFINE CLOUD MASKING FUNCTION
// -----------------------------------------------------------------------------
// Function to mask clouds and cirrus in Sentinel-2 imagery
function maskS2clouds(image) {
  // Bits 10 and 11 are clouds and cirrus, respectively, in Sentinel-2 QA60 band
  var cloudBitMask = ee.Number(2).pow(10).int();
  var cirrusBitMask = ee.Number(2).pow(11).int();
  var qa = image.select('QA60');
  
  // Both flags should be set to zero, indicating clear conditions
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));
  
  return image.updateMask(mask);
}

// -----------------------------------------------------------------------------
// 2. DEFINE SENTINEL-2 COLLECTION
// -----------------------------------------------------------------------------
// Select Sentinel-2 dataset, apply cloud masking, and select bands
var s2_collection = sentinel
  .filterBounds(extent)           // Filter for Apra Harbor extent
  .map(maskS2clouds)              // Apply cloud masking
  .select([0, 1, 2, 3, 4, 5, 6, 7, 8]); // Select first 9 bands

// -----------------------------------------------------------------------------
// 3. SAMPLE IMAGES FUNCTION
// -----------------------------------------------------------------------------
// Function to sample image values at turbidity monitoring sites
var sample_images = function(i) {
  return i.sampleRegions({
    collection: sites,      // Sample at turbidity monitoring sites
    scale: 10,              // Sampling scale in meters (Sentinel-2 resolution)
    geometries: false       // Don't include geometry in output
  });
};

// -----------------------------------------------------------------------------
// 4. APPLY SAMPLING AND PREVIEW RESULTS
// -----------------------------------------------------------------------------
var s2_samples = s2_collection.map(sample_images).flatten();
print(s2_samples.limit(300));

// -----------------------------------------------------------------------------
// 5. EXPORT TO GOOGLE DRIVE
// -----------------------------------------------------------------------------
Export.table.toDrive({
  collection: s2_samples,
  description: 'guam_s2_collection',
  folder: 'guam_turbidity',
  fileNamePrefix: 'guam_s2_collection',
  fileFormat: 'CSV'
});
