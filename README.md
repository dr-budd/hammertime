# :shark::dna: eDNA monitoring of scalloped hammerhead sharks

Analysis pipeline for:

> Budd, A.M., Schils, T., Cooper, M.K., Lyons, M.B., Mills, M.S., Deinhart, M.E., Le Port, A., Huerlimann, R. and Strugnell, J.M., 2023. Monitoring threatened species with environmental DNA and open ecological data: Local distribution and habitat preferences of scalloped hammerhead sharks (*Sphyrna lewini*). Biological Conservation, 278, p.109881.

:memo: https://doi.org/10.1016/j.biocon.2022.109881

---

## :file_folder: Structure

The code is separated into the following R markdown scripts that should be run in order:

- `01_SHS_survey_results.Rmd`

- `02_SHS_validation.Rmd`

- `03_SHS_temporal_analysis.Rmd`

- `04_SHS_spatial_analysis.Rmd`

## :chart_with_upwards_trend: Data

The required data is in `docs`

## :woman_technologist: Author
Alyssa Budd (alyssa.budd@my.jcu.edu.au)

## :bouquet: Acknowledgements
Scripts were developed in collaboration with Queensland Facility for Advanced Bioinformatics (QFAB). Specifically, Mike Thang wrote the original code for WGBS methlylation calling and Anne Bernard drafted the code for running multiple comparisons between treatments for the RNAseq count data.

## :copyright: License
This project is licensed under the GNU General Public License - see the [LICENSE](LICENSE.txt) file for details.