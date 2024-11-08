import express from "express";
import { checkToken } from "../middlewares/checkToken.js";
import {
  getContactsByController,
  createContact,
  deleteContact,
  updateContact,
} from "../controllers/contacts.js";

const router = express.Router();

router.get("/", checkToken, getContactsByController);
router.post("/", checkToken, createContact);
router.delete("/:contactId", checkToken, deleteContact);
router.patch("/:contactId", checkToken, updateContact);

export default router;
