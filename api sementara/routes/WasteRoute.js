import express from "express";
import {addWaste, getAllWastes} from "../controllers/WasteController.js"

const router = express.Router();

router.get('/waste', getAllWastes);
router.post('/waste', addWaste);

export default router;