import createHttpError from "http-errors";
import { parseFilterParams, parseSortParams } from "../utils/parseFilters.js";

import {
  createContactService,
  deleteContactService,
  getContacts,
  updateContactService,
} from "../services/contacts.js";

export const getContactsByController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getContacts({
      sortBy,
      sortOrder,
      filter,
      userId,
    });
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts",
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    next(createHttpError(500, "Failed to get contacts"));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await createContactService({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error.message);
    next(createHttpError(400, "Failed to create contact"));
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await deleteContactService(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, "Contact not found or not authorized");
    }
    res.status(204).json({ _id: contactId });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    next(createHttpError(404, "Contact not found"));
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContactService(
      contactId,
      req.user._id,
      req.body
    );

    if (!updatedContact) {
      throw createHttpError(404, "Contact not found or not authorized");
    }
    res.json(updatedContact);
  } catch (error) {
    console.error("Error in updateContact:", error.message);
    next(createHttpError(400, "Failed to update contact"));
  }
};
