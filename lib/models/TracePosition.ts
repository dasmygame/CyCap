import mongoose from 'mongoose'
import Position, { IPosition } from './Position'

export interface ITracePosition extends IPosition {
  traceId: mongoose.Types.ObjectId  // Reference to the trace
}

const tracePositionSchema = new mongoose.Schema({
  traceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trace',
    required: true,
    index: true
  }
})

// Check if the model exists before creating it
const TracePosition = mongoose.models.TracePosition || Position.discriminator<ITracePosition>('TracePosition', tracePositionSchema)

export default TracePosition 