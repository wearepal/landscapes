import { TileGridJSON } from "./modelling/tile_grid";


export function saveModelOutput(name: string, model: TileGridJSON, teamId: number) {

    console.log("Saving model output")

    const formData = new FormData()

    const blob = new Blob([JSON.stringify(model)], { type: "application/json" })

    formData.append('file', blob, 'dataset.json')
    formData.append('name', name)
    formData.append('team_id', teamId.toString())


    const request = new XMLHttpRequest()
    request.open('POST', `/teams/${teamId}/datasets`)
    request.setRequestHeader('X-CSRF-Token', (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content)
    request.send(formData)

}
