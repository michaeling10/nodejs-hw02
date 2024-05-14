const express = require("express");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error fetching contact:", error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const contact = await addContact(req.body);
  res.status(201).json(contact);
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await removeContact(req.params.contactId);
  if (contact) {
    res.json({ message: "Contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const contact = await updateContact(req.params.contactId, req.body);
  res.json(contact || { message: "Not found" });
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  if (req.body.favorite === undefined) {
    res.status(400).json({ message: "missing field favorite" });
  } else {
    const contact = await updateStatusContact(req.params.contactId, {
      favorite: req.body.favorite,
    });
    res.json(contact || { message: "Not found" });
  }
});

module.exports = router;
