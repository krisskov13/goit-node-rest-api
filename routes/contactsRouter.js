import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import { auth } from "../middleware/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);
contactsRouter.get("/:id", auth, getOneContact);
contactsRouter.delete("/:id", auth, deleteContact);
contactsRouter.post(
  "/",
  auth,
  validateBody(createContactSchema),
  createContact
);
contactsRouter.put(
  "/:id",
  auth,
  validateBody(updateContactSchema),
  updateContact
);
contactsRouter.patch(
  "/:id/favorite",
  auth,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

export default contactsRouter;
