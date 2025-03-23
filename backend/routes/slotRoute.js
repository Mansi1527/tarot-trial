import { Router } from "express";
import { getSlots,bookSlot, deleteSlot } from "../Controllers/slotController.js";

const router = Router();

router.get("/", getSlots);
router.post("/book", bookSlot);
router.delete("/delete",deleteSlot)

export default router;
