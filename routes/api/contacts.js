const express = require("express");
const {
  getAll,
  getById,
  deleteById,
  addNewContact,
  changeContact,
} = require("../../controllers/contacts");

const { isValidId } = require("../../middlewares/isValidId");
const { validateBody } = require("../../middlewares/validateBody");
const { addSchema, updateFavouriteSchema } = require("../../models/contact");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", isValidId, getById);

router.post("/", addNewContact);

router.delete("/:contactId", isValidId, deleteById);

router.put("/:contactId", validateBody(addSchema), isValidId, changeContact);

router.patch(
  "/:contactId/favorite",
  validateBody(updateFavouriteSchema),
  isValidId,
  changeContact
);

module.exports = router;
