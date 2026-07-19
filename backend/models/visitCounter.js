import mongoose from 'mongoose';

const visitCounterSchema = new mongoose.Schema(
	{
		counter: {
			type: String,
			required: true,
			unique: true
		},
		count: {
			type: Number,
			required: true,
			default: 0,
			min: 0
		}
	},
	{
		versionKey: false
	}
);

export default mongoose.model('VisitCounter', visitCounterSchema);
