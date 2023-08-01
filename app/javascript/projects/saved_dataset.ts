import { BooleanTileGrid, CategoricalTileGrid, NumericTileGrid, TileGridJSON, fromJSON } from "./modelling/tile_grid";

export interface CompiledDatasetRecord {
    name: string
    id: number
    team_id: number
    gridtype: string
    created_at: string
    updated_at: string
}

export function saveModelOutput(name: string, model: TileGridJSON, teamId: number) {
    const formData = new FormData()

    const blob = new Blob([JSON.stringify(model)], { type: "application/json" })

    formData.append('file', blob, 'dataset.json')
    formData.append('name', name)
    formData.append('team_id', teamId.toString())
    formData.append('gridtype', model.type)

    const request = new XMLHttpRequest()
    request.open('POST', `/teams/${teamId}/datasets`)
    request.setRequestHeader('X-CSRF-Token', (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content)
    request.send(formData)

}

export function getDatasets(teamId: number): Promise<Array<CompiledDatasetRecord>> {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('GET', `/teams/${teamId}/datasets?json=true`)
        request.setRequestHeader('X-CSRF-Token', (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content)
        request.onload = () => {
            if (request.status === 200) {
                resolve(JSON.parse(request.response))
            } else {
                reject(new Error('Failed to fetch datasets'))
            }
        }
        request.onerror = () => {
            reject(new Error('Request error'))
        }
        request.send()
    })
}

export function getDataset(datasetId: number, teamId: number, callback) {
    const request = new XMLHttpRequest()
    request.open('GET', `/datasets/${datasetId}?team_id=${teamId}`)
    request.setRequestHeader(
        'X-CSRF-Token',
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content
    )

    request.onload = function () {
        if (request.status === 200) {
            const response = JSON.parse(request.responseText)
            const dataset = fromJSON(response)
            callback(null, dataset)
        } else {
            callback(new Error('Request failed'))
        }
    };

    request.onerror = function () {
        callback(new Error('Request error'))
    };

    request.send()
}