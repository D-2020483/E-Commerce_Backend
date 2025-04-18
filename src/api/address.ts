import express from "express";
import {
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../Application/address";

const router = express.Router();

// Create a new address
router.post("/", createAddress);

// Get an address by ID
router.get("/:id", getAddress);

// Update an address
router.put("/:id", updateAddress);

// Delete an address
router.delete("/:id", deleteAddress);

export default router;