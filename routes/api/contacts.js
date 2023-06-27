const express = require("express");

const {
  getAll,
  getById,
  deleteById,
  addNewContact,
  changeContact,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", addNewContact);

router.delete("/:contactId", deleteById);

router.put("/:contactId", changeContact);

module.exports = router;
