export class NumericConstant {
    value: number
    name: string

    constructor(value: number, name: string | undefined) {
        this.value = value
        this.name = name === undefined ? "" : name
    }

    get(x: number, y: number, zoom: any = null): number {

        return this.value
    }

}