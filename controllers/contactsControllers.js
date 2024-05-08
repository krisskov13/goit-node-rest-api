import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);

    if (contact === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (deletedContact === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).send(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const createdContact = await Contact.create(contact);
    res.status(201).send(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
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

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });

    if (updatedContact === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  const { id } = req.params;
  const body = {
    favorite: req.body.favorite,
  };

  try {
    const updateStatusContact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (updateStatusContact === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).send(updateStatusContact);
  } catch (error) {
    next(error);
  }
};
