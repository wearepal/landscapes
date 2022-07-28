ogr2ogr is a program for converting map files between different formats.

Steps to install [GDAL](https://gdal.org/) and run [ogr2ogr](https://gdal.org/programs/ogr2ogr.html).

1. Create a [conda](https://docs.conda.io/en/latest/miniconda.html) environment with gdal installed: `conda env create -f ogr.yaml`
2. Activate the newly created env: `conda activate ogr`
3. run: `ogr2ogr -f GeoJSON -s_srs path/to/input_file.prj -t_srs EPSG:3857 path/to/output.json path/to/input/file.shp`
4. (Optional) Deactivate the environment when you're done: `conda deactivate`

The `-f` flag indicates the format for the output, which is GeoJSON.
The `-s_srs` flag specifies the source file spatial reference system (SRS) which is the projection we are starting with, and ogr2ogr can parse the file ending in .prj and get the projection from it.
The `t_srs` flag specifies the SRS that we are converting to, which in this case is EPSG:3857, which represents Pseudo Mercator, which is used by Open Street maps, Google maps, Bing maps etc.
The output file name, output.json.
The input file name, file.shp.
