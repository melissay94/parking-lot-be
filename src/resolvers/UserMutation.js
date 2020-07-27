const jwt = require('jsonwebtoken');
require('dotenv').config();

const setExpiration = () => 60 * 60 * 24;

async function signup(root, { name, email, password, role }, { models }) {
  const [user, createdUser] = await models.user.findOrCreate({
    where: {
      email: email
    },
    defaults: {
      email,
      password,
      name,
      role
    }
  });

  if (!createdUser) {
    throw new Error('Error, user already exists');
  }
  
  if (!user) {
    throw new Error('Error, unable to create new user');
  }

  const expires = setExpiration();
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, { expiresIn: `${expires}s`});
  today.setSeconds(today.getSeconds() + expires);

  return {
    user,
    expires: today.getTime(),
    token
  }
}

async function login(root, { email, password }, { currentUser, models }) {

  if (currentUser) {
    throw new Error("User already signed in");
  }
  
  const user = await models.user.findOne({
    where: { 
      email: email
    }
  });

  if (!user) {
    throw new Error('Could not login user')
  }

  if (!user.validPassword(password)) {
    throw new Error('Invalid password. Please try again.')
  }
  
  const expires = setExpiration();
  const today = new Date();
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, { expiresIn: `${expires}s`});
  today.setSeconds(today.getSeconds() + expires);

  return {
    user,
    expires: today.getTime(),
    token
  }
}

async function editCurrentUser(root, { name, email }, { currentUser, models }) {

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error(`${email} could not be found.`);
  }

  const updatedUser = await user.update({
    name: name || user.name,
    email: email || user.email
  });

  if (!updatedUser) {
    throw new Error(`${user.email} could not be updated.`);
  }
  
  const expires = setExpiration();
  const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET, { expiresIn: `${expires}s`});
  today.setSeconds(today.getSeconds() + expires);

  return {
    user,
    expires: today.getTime(),
    token
  }
}

async function editCurrentPassword(root, { password, newPassword }, { currentUser, models }) {

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error("Could not find user.");
  }

  if (!user.validPassword(password)) {
    throw new Error("Invalid password entered.");
  }

  const updatedUser = await user.update({
    password: newPassword
  });

  if (!updatedUser) {
    throw new Error(`${user.email}'s password could not be updated`);
  }
  
  const expires = setExpiration();
  const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET, { expiresIn: `${expires}s`});
  today.setSeconds(today.getSeconds() + expires);

  return {
    user,
    expires: today.getTime(),
    token
  }
}

async function deleteUser(root, { password }, { currentUser, models }) {

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error("Could not find user.");
  }

  if (!user.validPassword(password)) {
    throw new Error("Invalid password entered.");
  }

  const userDeleted = await models.user.destroy({
    where: {
      id: user.id
    }
  });

  return userDeleted > 0;

}

module.exports = {
  signup,
  login,
  editCurrentUser,
  editCurrentPassword,
  deleteUser
};
