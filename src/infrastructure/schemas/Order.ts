import mongoose from "mongoose";


const OrderProductSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false }); 


const ItemSchema = new mongoose.Schema({
  product: { type: OrderProductSchema, required: true },
  quantity: { type: Number, required: true },
}, { _id: false });


const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  addressId: { type: String, required: true }, 
  items: {
    type: [ItemSchema],
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING",
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING",
    required: true,
  },
}, {
  timestamps: true, 
});


const Order = mongoose.model("Order", OrderSchema);

export default Order;
