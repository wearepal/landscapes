export class NumericConstant {
    value: number
    name: string

    constructor(value: number, name: string | undefined) {
        this.value = value
        this.name = name === undefined ? "" : name
    }
}