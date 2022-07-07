import { expose } from 'threads'
import { generateDistanceMap } from '../modelling/worker/generateDistanceMap'
import { performOperation } from '../modelling/worker/performOperation'
import { rasteriseOverlay } from '../modelling/worker/rasteriseOverlay'

expose({
  generateDistanceMap,
  performOperation,
  rasteriseOverlay
})
