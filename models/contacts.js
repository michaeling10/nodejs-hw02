const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

async function loadContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

const listContacts = async () => {
  const contacts = await loadContacts();
  console.table(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await loadContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  console.log(contact);
};

const removeContact = async (contactId) => {
  const contacts = await loadContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
  console.log(`Contact with ID ${contactId} has been removed.`);
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: Math.random().toString(36).substring(2, 15),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
