import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const ctrlWrapper = (ctrl) => async (req, res, next) => {
  try {
    await ctrl(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = ctrlWrapper(async (req, res, next) => {
  const contacts = await contactsService.listContacts();
  res.status(200).json(contacts);
});

export const getOneContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

export const deleteContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const deletedContact = await contactsService.removeContact(id);
  if (deletedContact) {
    res.status(200).json(deletedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

export const createContact = ctrlWrapper(async (req, res, next) => {
  const { name, email, phone } = req.body;

  const { error } = createContactSchema.validate({ name, email, phone });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const createdContact = await contactsService.addContact(name, email, phone);
  res.status(201).json({
    id: createdContact.id,
    name: createdContact.name,
    email: createdContact.email,
    phone: createdContact.phone,
  });
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  if (Object.keys(body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  const { error } = updateContactSchema.validate(body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const updatedContact = await contactsService.updateContact(id, body);
  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});
