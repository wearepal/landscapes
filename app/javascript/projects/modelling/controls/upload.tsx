import * as React from "react"
import { Control } from "rete"

interface UploadControlProps{
    title: string
    types: string[]
    onSetFile: (file: File) => void
}

const UploadControlField = ({title, types, onSetFile} : UploadControlProps) => {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        if(file) {
            onSetFile?.(file)
            // Create preview URL for image files
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file)
                setPreviewUrl(url)
            }
        }
    };

    React.useEffect(() => {
        // Cleanup preview URL when component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    return <>
        <label>
            {title}
        </label>
        {previewUrl && (
            <div style={{ marginTop: '10px' }}>
                <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ 
                        maxWidth: '280px', 
                        maxHeight: '280px', 
                        objectFit: 'contain' 
                    }} 
                />
            </div>
        )}
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