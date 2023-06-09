import { Socket } from 'rete'

export const numberSocket = new Socket('Number')
export const booleanDataSocket = new Socket('Boolean dataset')

export const numericDataSocket = new Socket('Numeric dataset')

export const categoricalDataSocket = new Socket('Categorical dataset')

export const dataSocket = new Socket('Dataset')
booleanDataSocket.combineWith(dataSocket)
numericDataSocket.combineWith(dataSocket)
categoricalDataSocket.combineWith(dataSocket)

export const numericNumberDataSocket = new Socket('Number or Numeric dataset')
numberSocket.combineWith(numericNumberDataSocket)
numericDataSocket.combineWith(numericNumberDataSocket)

numericNumberDataSocket.combineWith(numberSocket)
numericNumberDataSocket.combineWith(numericDataSocket)
numericNumberDataSocket.combineWith(dataSocket)

