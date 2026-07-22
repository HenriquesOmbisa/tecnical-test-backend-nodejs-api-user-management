import mongoose, { Schema } from "mongoose";

const municipalitySchema = new Schema({
    name: { type: String, required: true },
    provinceId: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});

municipalitySchema.index({ name: 1, provinceId: 1 }, { unique: true })

const MunicipalityModel = mongoose.model("Municipality", municipalitySchema);

export default MunicipalityModel;