const { User } = require("../models/user");
const { HttpError } = require("../helpers/HttpError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/sendEmail");

dotenv.config();
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const { SECRET_KEY, BASE_URL } = process.env;

const registration = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email is already in use");
    }
    const avatarURL = gravatar.url(email);
    const result = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<p>Hello ${name}, <a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">click to verify email</a></p>`,
    };
    await sendEmail(verifyEmail);
    res.status(201).json({
      email: result.email,
      name: result.name,
      subscription: result.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Invalid email or password");
    }
    if (!user.verify) {
      throw HttpError(401, "Email is not verified");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Invalid email or password");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "22h" });
    await User.findByIdAndUpdate(user._id, { token }, { new: true });
    res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
        theme: user.theme,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: "Logout succesfull",
  });
};
const getCurrent = async (req, res, next) => {
  const { email, subscription, avatarURL, name, theme } = req.user;
  res.json({
    email,
    name,
    subscription,
    avatarURL,
    theme,
  });
};

const changeAvatar = async (req, res, next) => {
  try {
    const { email, _id } = req.user;
    const { path: tempUpload } = req.file;
    const [uniqName] = email.split("@");
    const image = await jimp.read(tempUpload);
    await image.resize(150, 150);
    await image.writeAsync(tempUpload);
    const resultUpload = path.join(avatarsDir, `${uniqName}.jpg`);
    avatarURL = path.join("avatars", `${uniqName}.jpg`);
    await fs.rename(tempUpload, resultUpload);
    const result = await User.findByIdAndUpdate(_id, { avatarURL });
    if (!result) {
      throw HttpError(401, "Not authorized");
    }
    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.redirect("https://maromaua.github.io/contacts-manager/#/confirm");
  } catch (error) {
    next(error);
  }
};

const resendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<p>Hello ${user.name}, <a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a></p>`,
    };
    await sendEmail(verifyEmail);
    res.json({ message: "Email has been sent" });
  } catch (error) {
    next(error);
  }
};

const changeSettings = async (req, res, next) => {
  try {
    const { email, _id } = req.user;
    const { name, subscription } = req.body;

    if (!req.file) {
      const user = await User.findByIdAndUpdate(
        _id,
        { name, subscription },
        {
          new: true,
        }
      );
      return res.json({
        name: user.name,
        subscription: user.subscription,
      });
    }
    const { path: tempUpload } = req.file;
    const [uniqName] = email.split("@");
    const image = await jimp.read(tempUpload);
    await image.resize(150, 150);
    await image.writeAsync(tempUpload);
    const resultUpload = path.join(avatarsDir, `${uniqName}.jpg`);
    avatarURL = path.join("avatars", `${uniqName}.jpg`);
    await fs.rename(tempUpload, resultUpload);
    const user = await User.findByIdAndUpdate(
      _id,
      {
        name,
        subscription,
        avatarURL,
      },
      {
        new: true,
      }
    );
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.json({
      name: user.name,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

const changeTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;

    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, { theme }, { new: true });

    if (!user) {
      HttpError(404, "User not found");
    }
    res.json({
      theme: user.theme,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registration,
  login,
  logout,
  getCurrent,
  changeAvatar,
  verifyToken,
  resendEmail,
  changeSettings,
  changeTheme,
};
