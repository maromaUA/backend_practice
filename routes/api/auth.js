const express = require("express");
const {
  registrationSchema,
  loginSchema,
  changeThemeSchema,
} = require("../../models/user");
const { validateBody } = require("../../middlewares/validateBody");
const {
  registration,
  login,
  logout,
  getCurrent,
  changeAvatar,
  changeSettings,
  changeTheme,
} = require("../../controllers/auth");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", validateBody(registrationSchema), registration);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrent);
router.patch("/avatars", authenticate, upload.single("avatar"), changeAvatar);
router.put("/settings", authenticate, upload.single("avatar"), changeSettings);
router.patch(
  "/theme",
  authenticate,
  validateBody(changeThemeSchema),
  changeTheme
);
module.exports = router;
