import { Control, Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Extent } from 'ol/extent'
import { DateControl } from '../controls/date'
import { SelectControl, SelectControlOptions } from '../controls/select'
import { CheckboxControl, CheckboxControlOptions } from '../controls/checkboxgroup'
import { numericDataSocket } from '../socket_types'
import { NumericTileGrid, toIndex } from '../tile_grid'
import { createXYZ } from 'ol/tilegrid'
import { Coordinate } from 'ol/coordinate'
import { Point } from 'ol/geom'
import { EPSG3857, EPSG4326, WKTfromExtent } from '../bounding_box'
import * as proj4 from 'proj4'


type SpeciesCheckboxControlOptions = CheckboxControlOptions & {
    familyId: number
    scientificSpeciesName: string
}

type SpeciesFamilySelectControlOptions = SelectControlOptions & {
    family: string

}

const speciesFamilyList: SpeciesFamilySelectControlOptions[] = [
    {
        name: 'Ladybird (Coccinellidae)',
        id: 1,
        family: 'Coccinellidae'
    },
    {
        name: 'Eel (Anguillidae)',
        id: 2,
        family: 'Anguillidae'
    },
    {
        name: 'Salmon & Trout (Salmonidae)',
        id: 3,
        family: 'Salmonidae'
    }
]

const speciesList: SpeciesCheckboxControlOptions[] = [
    {
        familyId: 1,
        name: 'Anatis ocellata (Eyed ladybird)',
        id: 1,
        scientificSpeciesName: 'Anatis ocellata'
    },
    {
        familyId: 1,
        name: 'Myzia oblongoguttata (Striped ladybird)',
        id: 2,
        scientificSpeciesName: 'Myzia oblongoguttata'
    }, 
    {
        familyId: 1,
        name: 'Coccinella 7‐punctata (Seven-spot ladybird)',
        id: 3,
        scientificSpeciesName: 'Coccinella septempunctata'
    },
    {
        familyId: 1,
        name: 'Harmonia 4-punctata (Cream-streaked ladybird)',
        id: 4,
        scientificSpeciesName: 'Harmonia quadripunctata'
    },
    {
        familyId: 1,
        name: 'Halyzia 16-guttata (Orange ladybird)',
        id: 5,
        scientificSpeciesName: 'Halyzia sedecimguttata'
    },
    {
        familyId: 1,
        name: 'Adalia 2-punctata (Two-spot ladybird)',
        id: 6,
        scientificSpeciesName: 'Adalia bipunctata'
    },
    {
        familyId: 1,
        name: 'Calvia 14-guttata (Cream-spot ladybird)',
        id: 7,
        scientificSpeciesName: 'Calvia quattuordecimguttata'
    },
    {
        familyId: 1,
        name: 'Chilocorus renipustulatus (Kidney-spot ladybird)',
        id: 8,
        scientificSpeciesName: 'Chilocorus renipustulatus'
    },
    {
        familyId: 1,
        name: 'Hippoidea variegata (Adonis` ladybird)',
        id: 9,
        scientificSpeciesName: 'Hippodamia variegata'
    },
    {
        familyId: 1,
        name: 'Adalia 10-punctata (10-spot ladybird)',
        id: 10,
        scientificSpeciesName: 'Adalia decempunctata'
    },
    {
        familyId: 1,
        name: 'Propylea 14-punctata (14-spot ladybird)',
        id: 11,
        scientificSpeciesName: 'Propylea quattuordecimpunctata'
    },
    {
        familyId: 1,
        name: 'Exochomus 4-pustulatus (Pine ladybird)',
        id: 12,
        scientificSpeciesName: 'Exochomus quadripustulatus'
    },
    {
        familyId: 1,
        name: 'Psyllobora 22-punctata (22-spot ladybird)',
        id: 13,
        scientificSpeciesName: 'Psyllobora vigintiduopunctata'
    },
    {
        familyId: 1,
        name: 'Subcoccinella 24-punctata (24-spot ladybird)',
        id: 14,
        scientificSpeciesName: 'Subcoccinella vigintiquattuorpunctata'
    },
    {
        familyId: 1,
        name: 'Tytthaspis 16‐punctata (16-spot ladybird)',
        id: 15,
        scientificSpeciesName: 'Tytthaspis sedecimpunctata'
    },
    {
        familyId: 2,
        name: 'European eel (Anguilla anguilla)',
        id: 16,
        scientificSpeciesName: 'Anguilla anguilla'
    },
    {
        familyId: 3,
        name: 'Sea/Brown trout (Salmo trutta Linnaeus)',
        id: 17,
        scientificSpeciesName: 'Salmo trutta Linnaeus'
    },
    {
        familyId: 3,
        name: 'Brown trout (Salmo trutta subsp. fario Linnaeus)',
        id: 18,
        scientificSpeciesName: 'Salmo trutta subsp. fario Linnaeus'
    },
    {
        familyId: 3,
        name: 'Sea trout (Salmo trutta subsp. trutta Linnaeus)',
        id: 19,
        scientificSpeciesName: 'Salmo trutta subsp. trutta Linnaeus'
    }
]


async function fetchSpeciesFromExtent(extent: Extent, familyId: number, selectedSpecies: number[], dateFrom: Date, dateTo: Date) {

    const wkt = WKTfromExtent(extent)
    const points: Coordinate[] = []

    for (const species of selectedSpecies) {
        const speciesEntry = speciesList.find(s => s.id === species)

        if (speciesEntry === undefined || speciesEntry.familyId != familyId)  continue 

        const speciesName = speciesEntry.scientificSpeciesName
        
        const r = await fetch(`https://records-ws.nbnatlas.org/occurrences/search?q=*:*&fq=species:${speciesName}&wkt=${wkt}&pageSize=900000000`)
        const data = await r.json()

        const occurrences = data.occurrences

        for (const occurrence of occurrences) {
            const occurrenceDate = new Date(occurrence.eventDate)
            if (occurrenceDate < dateFrom || occurrenceDate > dateTo ) {
                continue
            }else{
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

        const speciesFamilyId = node.data.speciesFamilyId || 1

        const speciesFamily = speciesList.filter(family => family.familyId === +speciesFamilyId)

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

        node.meta.toolTip = "Given species and two dates (optional), return the number of recorded sightings of species within the given dates and extent."
        node.meta.toolTipLink = "https://nbnatlas.org/"

        node.addControl(
            new SelectControl(
                this.editor,
                'speciesFamilyId',
                () => speciesFamilyList,
                () => this.updateSpeciesList(node).then(() => this.loadSpeciesFamilyList(node)),
                'Species Family'
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
            if(toIndex(result, featureTileRange.maxX, featureTileRange.minY) !== undefined) {
                result.set(featureTileRange.maxX, featureTileRange.minY, v)
            }
            
        }


        editorNode.update()

    }

}