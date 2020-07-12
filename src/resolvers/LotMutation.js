// Helper function to create a unique random code.
const generateRandomCode = codes => {
  const codeLength = 8;
  const asciiRanges = [
    { start: 97, end: 122 }, 
    { start: 65, end: 90 }, 
    { start: 48, end: 57 }
  ];

  do {
    var code = "";

    for (let i = 0; i < codeLength; i++) {
      const asciiRange = Math.floor(Math.random() * 3);
      const currentIndex = Math.floor(Math.random() * (asciiRanges[asciiRange].end - asciiRanges[asciiRange].start + 1) + asciiRanges[asciiRange].start);
      code += String.fromCharCode(currentIndex);
    }
  } while (codes.includes(code));

  return code;
}

async function createLot(root, { name, description }, { currentUser, models }) {

  const lots = await models.lot.findAll({
    attributes: ['code']
  });

  if (!lots) {
    throw new Error("Could not get lots to add new lot to.");
  }

  const codes = lots.map(lot => {
    return lot.code;
  });

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error("Could not find current user.");
  }

  const [lot, createdLot] = await models.lot.findOrCreate({
    where: {
      name: name
    },
    defaults: {
      name,
      description,
      code: generateRandomCode(codes),
      authorId: user.id
    }
  });

  if (!createdLot) {
    throw new Error(`${name} lot already exists.`);
  }

  if (!lot) {
    throw new Error(`Could not create ${name} lot for user ${user.email}.`);
  }

  return lot;

}

async function joinLot(root, { id, code }, { currentUser, models }) {

  const lot = await models.lot.findOne({
    where: {
      id
    }
  });

  if (!lot) {
    throw new Error("Could not find lot to join.");
  }

  if (lot.code !== code) {
    throw new Error(`Codes do not match. Cannot join ${lot.name}.`);
  }

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    },
    include: models.lot
  });

  if (!user) {
    throw new Error(`Could not find user. Cannot join ${lot.name}`);
  }

  const userLots = user.lots.map(lot => lot.id);

  if (userLots.includes(user.id)) {
    throw new Error(`${user.email} already belongs to ${lot.name}.`);
  }

  const joined = await lot.addUsers(user);

  return joined ? true : false;

}

async function editLot(root, { id, name, description }, { currentUser, models }) {

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error("Could not find current user. Cannot update lot.");
  }

  const lot = await models.lot.findOne({
    where: {
      id
    }
  });

  if (!lot) {
    throw new Error("Could not find lot to update.")
  }

  if (lot.authorId !== user.id) {
    throw new Error(`${user.email} is not the author of the ${lot.name} lot. Cannot update.`);
  }

  const updatedLot = await lot.update({
    name: name || lot.name,
    description: description || lot.description
  });

  if (!updatedLot) {
    throw new Error(`${lot.name} lot could not be updated.`);
  }

  return updatedLot;

}

async function deleteLot(root, { id }, { currentUser, models }) {

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error("Could not find current user.");
  }

  const lot = await models.lot.findOne({
    where: {
      id
    },
    include: models.user
  });

  if (!lot) {
    throw new Error("Could not find lot to delete.");
  }

  if(lot.authorId !== user.id) {
    throw new Error(`${user.email} is not the author of the ${lot.name} lot. Cannot delete.`);
  }

  if(lot.users.length === 0) {
    const lotDeleted = await models.lot.destroy({ 
      where: {
        id
      }
    });

    return lotDeleted > 0;
  } 

  const updatedLot = await lot.update({
    authorId: lot.users[0].id
  });

  if (!updatedLot) {
    throw new Error(`${lot.name} lot cannot be removed from ${user.email}'s account.`);
  }

  const removeAuthorFromUsers = await updatedLot.removeUsers(lot.users[0].id);

  return removeAuthorFromUsers ? true : false;
}

module.exports = {
  createLot, 
  joinLot, 
  editLot, 
  deleteLot
};
