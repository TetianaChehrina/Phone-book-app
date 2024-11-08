import { Contact } from "../db/models/contact.js";

export const getContacts = async ({
  sortOrder = 1,
  sortBy = "name",
  filter = {},
  userId,
}) => {
  const contactsQuery = Contact.find({ userId });

  if (filter.type) {
    contactsQuery.where("contactType").equals(filter.type.toLowerCase());
  }

  if (filter.isFavourite === true) {
    contactsQuery.where("isFavourite").equals(true);
  }

  if (filter.name) {
    contactsQuery.where("name").regex(new RegExp(filter.name, "i"));
  }

  if (filter.number) {
    contactsQuery.where("phoneNumber").regex(new RegExp(filter.number, "i"));
  }

  const contacts = await contactsQuery.sort({ [sortBy]: sortOrder }).exec();

  return contacts;
};

export const createContactService = (contactData) =>
  Contact.create(contactData);

export const deleteContactService = (contactId, userId) =>
  Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });

export const updateContactService = (contactId, userId, contactData) =>
  Contact.findOneAndUpdate({ _id: contactId, userId }, contactData, {
    new: true,
  });
