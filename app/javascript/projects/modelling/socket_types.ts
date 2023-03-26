import { Socket } from 'rete'

export const numberSocket = new Socket('Number')
export const booleanDataSocket = new Socket('Boolean dataset')
export const numericDataSocket = new Socket('Numeric dataset')

export const dataSocket = new Socket('Dataset')
booleanDataSocket.combineWith(dataSocket)
numericDataSocket.combineWith(dataSocket)
