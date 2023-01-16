import { Component, Output } from 'rete'
import { setSocket } from '../sockets'


export class InputHabitatComponent extends Component {

    constructor() {
        super('Input habitat')
        this.category = 'Inputs & Outputs'
        
        this.habitats = [
            //TODO : move to a json or an alternative storage
            {agg : 1, AC : 'Deciduous Woodland', mode: 1, LC : 'Deciduous Woodland'},

            {agg : 2, AC : 'Coniferous Woodland', mode: 2, LC : 'Coniferous Woodland'},

            {agg : 3, AC : 'Arable', mode: 3, LC : 'Arable'},

            {agg : 4, AC : 'Improved Grassland', mode: 4, LC : 'Improved Grassland'},

            {agg : 5, AC : 'Semi-natural Grassland', mode: 5, LC : 'Neutral Grassland'},
            {agg : 5, AC : 'Semi-natural Grassland', mode: 6, LC : 'Calcareous Grassland'},
            {agg : 5, AC : 'Semi-natural Grassland', mode: 7, LC : 'Acid Grassland'},
            {agg : 5, AC : 'Semi-natural Grassland', mode: 8, LC : 'Fen'},

            {agg : 6, AC : 'Mountain, Heath and Bog', mode: 9, LC : 'Heather'},
            {agg : 6, AC : 'Mountain, Heath and Bog', mode: 10, LC : 'Heather Grassland'},
            {agg : 6, AC : 'Mountain, Heath and Bog', mode: 11, LC : 'Bog'},
            {agg : 6, AC : 'Mountain, Heath and Bog', mode: 12, LC : 'Inland Rock'},

            {agg : 7, AC : 'Saltwater', mode: 13, LC : 'Saltwater'},

            {agg : 8, AC : 'Freshwater', mode: 14, LC : 'Freshwater'},

            {agg : 9, AC : 'Coastal', mode: 15, LC : 'Supralittoral Rock'},
            {agg : 9, AC : 'Coastal', mode: 16, LC : 'Supralittoral Sediment'},
            {agg : 9, AC : 'Coastal', mode: 17, LC : 'Littoral Rock'},
            {agg : 9, AC : 'Coastal', mode: 18, LC : 'Littoral Sediment'},
            {agg : 9, AC : 'Coastal', mode: 19, LC : 'Saltmarsh'},

            {agg : 10, AC : 'Built-up areas and gardens', mode: 20, LC : 'Urban'},
            {agg : 10, AC : 'Built-up areas and gardens', mode: 21, LC : 'Suburban'},
        ]
    }

    

    builder(node) {

        //create outputs for each type of habitat. 

        this.habitats.forEach((hab)=>{
            node.addOutput(new Output(hab['mode'], hab['LC'], setSocket))
        })

    

    }

    async worker(node, inputs, outputs) {

    }


}