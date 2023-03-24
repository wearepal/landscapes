import { Socket } from 'rete'

export const booleanDataSocket = new Socket('Boolean dataset')
export const numericDataSocket = new Socket('Numeric dataset')

export const numberSocket = new Socket('Number')
numberSocket.compatibleWith(numericDataSocket)
