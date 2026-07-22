import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    provinceId: { type: String, required: true },
    municipalityId: { type: String, required: true },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true,
    versionKey: false,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;