import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true,
        trim: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    azureUrl: {
        type: String,
        required: true
    },
    azurePublicId: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['uploaded', 'processing', 'ready', 'error'],
        default: 'uploaded'
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
fileSchema.index({ uploadedAt: -1 });
fileSchema.index({ status: 1 });
fileSchema.index({ cloudinaryPublicId: 1 });

const File = mongoose.model('File', fileSchema);
export default File;
