import { expose } from 'threads'
import { generateDistanceMap } from '../modelling/worker/generateDistanceMap'
import { performOperation } from '../modelling/worker/performOperation'
import { rasteriseOverlay } from '../modelling/worker/rasteriseOverlay'
import { interpolateGrid } from '../modelling/worker/interpolation'
import { calculateAspect, calculateContour, calculateSlope, calculateTWI, calculateContourLengthPerCell, calculateFlowAccumulation, calculateD8FlowDirection } from '../modelling/worker/slopeOperations'

expose({
  generateDistanceMap,
  performOperation,
  rasteriseOverlay,
  interpolateGrid,
  calculateTWI,
  calculateSlope,
  calculateContour,
  calculateAspect,
  calculateContourLengthPerCell,
  calculateFlowAccumulation,
  calculateD8FlowDirection
})
