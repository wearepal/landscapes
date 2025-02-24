import * as React from "react"
import { Control } from "rete"

interface UploadControlProps{
    title: string
    types: string[]
    onSetFile: (file: File) => void

}

const UploadControlField = ({title, types, onSetFile} : UploadControlProps) => {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        if(file) onSetFile?.(file)
    };

    return <>
        <label>
            {title}
        </label>
        <br/>
        <input
            type="file"
            accept={types.join(',')}
            onChange={handleFileChange}
        />
    </>
}

export class UploadControl extends Control {
    props: UploadControlProps
    component: (props: UploadControlProps) => JSX.Element

    constructor(key: string, title: string, types: string[]) {
        super(key)

        this.props = {
            title,
            types: types,
            onSetFile: (file: File) => {
                this.putData(key, file)
                console.log(file)
                console.log(this.getData(key))
            }       
        }

        this.component = UploadControlField
    }

}