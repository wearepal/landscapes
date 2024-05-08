import { Control, Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Extent } from 'ol/extent'
import { DateControl } from '../controls/date'
import { SelectControl } from '../controls/select'
import { CheckboxControl } from '../controls/checkboxgroup'
import { numericDataSocket } from '../socket_types'
import { NumericTileGrid, toIndex } from '../tile_grid'
import { createXYZ } from 'ol/tilegrid'
import { Coordinate } from 'ol/coordinate'
import { Point } from 'ol/geom'
import { EPSG3857, EPSG4326, WKTfromExtent, maskFromExtentAndShape } from '../bounding_box'
import * as proj4 from 'proj4'
import { speciesFamilyList, speciesList } from '../nbnatlas_species'

const cache = new Map<number, any>()


async function fetchSpeciesFromExtent(extent: Extent, familyId: number, selectedSpecies: number[], dateFrom: Date, dateTo: Date) {
    const wkt = WKTfromExtent(extent)
    const points: Coordinate[] = []

    for (const species of selectedSpecies) {

        let oc: any[] = []
        const speciesEntry = speciesList.find(s => s.id === species)
        if (speciesEntry === undefined || speciesEntry.familyId != familyId)  continue 
        const speciesName = speciesEntry.scientificSpeciesName
        const subspName = speciesEntry.scientificSubSpeciesName

        if(cache.has(species)) {
            oc = cache.get(species)
        }else{
            const pageSize = 1000
            let startIndex = 0
            const r = await fetch(`https://records-ws.nbnatlas.org/occurrences/search?q=species:"${speciesName}"&wkt=${wkt}&pageSize=${pageSize}&startIndex=${startIndex}&sort=id`)
            
            const data = await r.json()
            const occurrences = data.occurrences
            const totalRecords = data.totalRecords

            while(occurrences.length < totalRecords) {
                // Recommendations from NBN encourage to use a page size of 1000, if the total records are greater than 1000, we need to paginate
                startIndex += pageSize
                const r = await fetch(`https://records-ws.nbnatlas.org/occurrences/search?q=species:"${speciesName}"&wkt=${wkt}&pageSize=${pageSize}&startIndex=${startIndex}&sort=id`)
                const d = await r.json()
                occurrences.push(...d.occurrences)
            }

            cache.set(species, occurrences)
            oc = occurrences
        }

        for (const occurrence of oc) {
            const occurrenceDate = new Date(occurrence.eventDate)
            if (occurrenceDate < dateFrom || occurrenceDate > dateTo) {
                continue
            }else{
                if(subspName) if(!occurrence.scientificName.includes(subspName)) continue
                const [x, y] = (proj4 as any).default(EPSG4326, EPSG3857, [occurrence.decimalLongitude, occurrence.decimalLatitude])
                const p = new Point([x, y])
                points.push(p.getCoordinates())
            }
        }
        
    }

    return points
}

export class BiodiversityComponent extends BaseComponent {
    projectExtent: Extent
    projectZoom: number

    constructor(projectExtent: Extent, projectZoom: number) {
        super('Recorded species')
        this.category = 'Inputs'
        this.projectExtent = projectExtent
        this.projectZoom = projectZoom
    }

    async loadSpeciesFamilyList(node: Node) {

        const speciesFamilyId = (node.data.speciesFamilyId || 1) as number

        const speciesFamily = speciesList.filter(family => family.familyId == speciesFamilyId).sort((a, b) => a.name.localeCompare(b.name))

        node.addControl(
            new CheckboxControl(
                this.editor, 
                'Species', 
                speciesFamily
            )
        )

        node.update()
    }

    async updateSpeciesList(node: Node) {        
        const prevControl = node.controls.get('Species')

        if(prevControl instanceof Control) {
            node.removeControl(prevControl)
            node.update()
        }
    }

    async builder(node: Node) {

        node.meta.toolTip = "Given species and two dates (optional), return the number of recorded sightings of species within the given dates and extent. Please note, data is blurred for privacy reasons and may not represent the exact location of the sighting."
        node.meta.toolTipLink = "https://nbnatlas.org/"

        node.addControl(
            new SelectControl(
                this.editor,
                'speciesFamilyId',
                () => speciesFamilyList.sort((a, b) => a.name.localeCompare(b.name)),
                () => this.updateSpeciesList(node).then(() => this.loadSpeciesFamilyList(node)),
                'Family'
            )
        )

        node.addControl(
            new DateControl(this.editor, 'DateFrom')
        )
        node.addControl(
            new DateControl(this.editor, 'DateTo')
        )

        this.loadSpeciesFamilyList(node)

        node.addOutput(new Output('out', 'Output', numericDataSocket))

    }

    async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) {
        const editorNode = this.editor?.nodes.find(n => n.id === node.id)
        if (editorNode === undefined) { return }

        
        const mask = await maskFromExtentAndShape(this.projectExtent, this.projectZoom, "shapefiles:westminster_const", "Name='Brighton, Pavilion Boro Const'")

        const speciesFamilyId = node.data.speciesFamilyId || 1
        
        const tileGrid = createXYZ()
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectExtent, this.projectZoom)

        const result = editorNode.meta.output = outputs['out'] = new NumericTileGrid(
            this.projectZoom,
            outputTileRange.minX,
            outputTileRange.minY,
            outputTileRange.getWidth(),
            outputTileRange.getHeight()
        )

        const points = await fetchSpeciesFromExtent(this.projectExtent, speciesFamilyId as number ,node.data.Species as number[], new Date(node.data.DateFrom as string), new Date(node.data.DateTo as string))

        for (const point of points) {
            const p = new Point(point)
            const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                p.getExtent(),
                this.projectZoom
            )

            const v = isNaN(result.get(featureTileRange.maxX, featureTileRange.minY)) ? 1 : result.get(featureTileRange.maxX, featureTileRange.minY) + 1
            
            // Conversion from EPSG:4326 to EPSG:3857 is not perfect, so we need to check if the point is within the tile range
            if(toIndex(result, featureTileRange.maxX, featureTileRange.minY) !== undefined && mask.get(featureTileRange.maxX, featureTileRange.minY) === true){
                result.set(featureTileRange.maxX, featureTileRange.minY, v)
            }
            
        }
        editorNode.update()

    }

}