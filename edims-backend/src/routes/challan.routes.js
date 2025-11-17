import { Router } from "express";
import {
  createChallan,
  getAllChallans,
  getChallanById,
  getChallanItemsSummary,
  getUnlinkedChallans
} from "../controllers/challan.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Auth middleware
router.use(protect);

// ------------------------------
// ALL CHALLANS → Challan page
// ------------------------------
router.get("/", getAllChallans);

// ------------------------------
// MUST BE BEFORE :id !!!
router.get("/unlinked", getUnlinkedChallans);

// ------------------------------
// ITEMS SUMMARY
// ------------------------------
router.get("/items-summary/query", getChallanItemsSummary);

// ------------------------------
// GET BY ID → must be last catch route
// ------------------------------
router.get("/:id", getChallanById);

// ------------------------------
// CREATE CHALLAN
// ------------------------------
router.post("/", createChallan);

export default router;
