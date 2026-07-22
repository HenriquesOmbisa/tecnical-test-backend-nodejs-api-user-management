import mongoose, { Schema } from "mongoose";

const provinceSchema = new Schema({
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true,
    versionKey: false,
});

const ProvinceModel = mongoose.model("Province", provinceSchema);

export default ProvinceModel;