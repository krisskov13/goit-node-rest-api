import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contacts = await Contact.find({ owner });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const contact = await Contact.findOne({ id, owner });

    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const deletedContact = await Contact.findByIdAndDelete({ id, owner });

    if (!deletedContact) {
      throw HttpError(404);
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const createdContact = await Contact.create({ ...req.body, owner });
    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const updatedContact = await Contact.findByIdAndUpdate(
      { id, owner },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const body = {
      favorite: req.body.favorite,
    };

    const updateStatusContact = await Contact.findByIdAndUpdate(
      { id, owner },
      body,
      {
        new: true,
      }
    );

    if (!updateStatusContact) {
      throw HttpError(404);
    }

    res.status(200).json(updateStatusContact);
  } catch (error) {
    next(error);
  }
};
