import { NumericTileGrid } from "./tile_grid"

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

    performCalculation(type: string, num: NumericConstant) {
        switch (type) {
            case 'Multiply':
                return (this.value * num.value)
                break;
            case 'Add':
                return (this.value + num.value)
                break;
            case 'Subtract':
                return (this.value - num.value)
                break;
            case 'Divide':
                return (this.value / num.value)
                break;
            case 'Power':
                return (this.value ** num.value)
                break;
            case 'Min':
                return Math.min(this.value, num.value)
                break;
            case 'Max':
                return Math.max(this.value, num.value)
                break;
            default:
                return (0)
                break;
        }
    }

    asNumericTileGrid() {
        return new NumericTileGrid(0, 0, 0, 1, 1, this.value)
    }

}