const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const arr = await listContacts();
  console.log(arr);
  const result = arr.find((el) => el.id === contactId);
  return result || null;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  let index;
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === contactId) {
      index = i;
    }
  }
  const obj = data[index];
  data.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return obj;
};

const addContact = async (body) => {
  const data = await listContacts();
  const { name, email, phone } = body;
  const obj = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  data.push(obj);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return obj;
};

const updateContact = async (contactId, body) => {
  const arr = await listContacts();
  const index = arr.findIndex((el) => el.id === contactId);
  if (index === -1) {
    return null;
  }
  arr[index] = { id: arr[index].id, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(arr, null, 2));
  return arr[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
