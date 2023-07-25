const express = require("express");
const {
  registrationSchema,
  loginSchema,
  verifyEmailSchema,
} = require("../../models/user");
const { validateBody } = require("../../middlewares/validateBody");
const {
  registration,
  login,
  logout,
  getCurrent,
  changeAvatar,
  verifyToken,
  resendEmail,
  changeSettings,
} = require("../../controllers/auth");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
//const { verify } = require("jsonwebtoken");

const router = express.Router();

router.post("/register", validateBody(registrationSchema), registration);
router.get("/verify/:verificationToken", verifyToken);
router.post("/verify", validateBody(verifyEmailSchema), resendEmail);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrent);
router.patch("/avatars", authenticate, upload.single("avatar"), changeAvatar);
router.put("/settings", authenticate, upload.single("avatar"), changeSettings);
module.exports = router;
