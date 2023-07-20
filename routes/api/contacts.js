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
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.get("/", authenticate, getAll);

router.get("/:contactId", authenticate, isValidId, getById);

router.post("/", authenticate, validateBody(addSchema), addNewContact);

router.delete("/:contactId", authenticate, isValidId, deleteById);

router.put(
  "/:contactId",
  authenticate,
  validateBody(addSchema),
  isValidId,
  changeContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(updateFavouriteSchema),
  isValidId,
  changeContact
);

module.exports = router;
