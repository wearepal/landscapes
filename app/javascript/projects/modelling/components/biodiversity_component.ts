import { Control, Input, Node, Output, Socket } from 'rete'
import { BaseComponent } from './base_component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Extent } from 'ol/extent'
import { DateControl } from '../controls/date'
import { SelectControl, SelectControlOptions } from '../controls/select'
import { CheckboxControl, CheckboxControlOptions } from '../controls/checkboxgroup'
import { numericDataSocket } from '../socket_types'
import { NumericTileGrid } from '../tile_grid'
import { createXYZ } from 'ol/tilegrid'
import { Coordinate } from 'ol/coordinate'
import { Point } from 'ol/geom'


type SpeciesCheckboxControlOptions = CheckboxControlOptions & {
    familyId: number
}

const speciesFamilyList: SelectControlOptions[] = [
    {
        name: 'Ladybird (Coccinellidae)',
        id: 1
    }
]

const speciesList: SpeciesCheckboxControlOptions[] = [
    {
        familyId: 1,
        name: 'Anatis ocellata (Eyed ladybird)',
        id: 1
    },
    {
        familyId: 1,
        name: 'Myzia oblongoguttata (Striped ladybird)',
        id: 2
    }, 
    {
        familyId: 1,
        name: 'Coccinella 7‐punctata (Seven-spot ladybird)',
        id: 3
    },
    {
        familyId: 1,
        name: 'Harmonia 4-punctata (Cream-streaked ladybird)',
        id: 4
    },
    {
        familyId: 1,
        name: 'Halyzia 16-guttata (Orange ladybird)',
        id: 5
    },
    {
        familyId: 1,
        name: 'Adalia 2-punctata (Two-spot ladybird)',
        id: 6
    },
    {
        familyId: 1,
        name: 'Calvia 14-guttata (Cream-spot ladybird)',
        id: 7
    },
    {
        familyId: 1,
        name: 'Chilocorus renipustulatus (Kidney-spot ladybird)',
        id: 8
    },
    {
        familyId: 1,
        name: 'Hippoidea variegata (Adonis` ladybird)',
        id: 9
    },
    {
        familyId: 1,
        name: 'Adalia 10-punctata (10-spot ladybird)',
        id: 10
    },
    {
        familyId: 1,
        name: 'Propylea 14-punctata (14-spot ladybird)',
        id: 11
    },
    {
        familyId: 1,
        name: 'Exochomus 4-pustulatus (Pine ladybird)',
        id: 12
    },
    {
        familyId: 1,
        name: 'Psyllobora 22-punctata (22-spot ladybird)',
        id: 13
    },
    {
        familyId: 1,
        name: 'Subcoccinella 24-punctata (24-spot ladybird)',
        id: 14
    },
    {
        familyId: 1,
        name: 'Tytthaspis 16‐punctata (16-spot ladybird)',
        id: 15
    }
]

async function fetchSpeciesFromExtent(extent: Extent, selectedSpecies: number[], dateFrom: Date, dateTo: Date) {

    for (const species of selectedSpecies) {
        const s = speciesList.find(s => s.id === species)
        console.log(s)
    }

    const points: Coordinate[] = []

    // fetch points from API

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

        node.meta.toolTip = "Given species and two dates, return the number of recorded sightings of species within the given dates and extent."
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
        const speciesFamily = speciesList.filter(family => family.familyId === +speciesFamilyId)

        
        const tileGrid = createXYZ()
        const outputTileRange = tileGrid.getTileRangeForExtentAndZ(this.projectExtent, this.projectZoom)

        const result = editorNode.meta.output = outputs['out'] = new NumericTileGrid(
            this.projectZoom,
            outputTileRange.minX,
            outputTileRange.minY,
            outputTileRange.getWidth(),
            outputTileRange.getHeight()
        )

        const points = await fetchSpeciesFromExtent(this.projectExtent, node.data.Species as number[], new Date(node.data.DateFrom as string), new Date(node.data.DateTo as string))

        for (const point of points) {
            const p = new Point(point)
            const featureTileRange = tileGrid.getTileRangeForExtentAndZ(
                p.getExtent(),
                this.projectZoom
            )
            const v = isNaN(result.get(featureTileRange.maxX, featureTileRange.minY)) ? 1 : result.get(featureTileRange.maxX, featureTileRange.minY) + 1
            result.set(featureTileRange.maxX, featureTileRange.minY, v)
        }


        editorNode.update()

    }

}