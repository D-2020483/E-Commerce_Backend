import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalAmount :{
        type: Number,
        required: true,
    },
    status :{
        type: String,
        default: "Pending",
    },
    createAt :{
        type: Date,        
        default: Date.now,
    },
});

export default mongoose.model("Order", orderSchema);