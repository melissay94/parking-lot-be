async function currentUser(root, args, { currentUser, models }) {

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (user) {
    return user;
  } else {
    throw new Error("Current user not found");
  }
}

async function lot(root, { id }, { models }) {
  const lot = await models.lot.findOne({
    where: {
      id
    }
  });

  if (!lot) {
    throw new Error("Lot not found");
  }

  return lot;
}

async function lots(root, args, { models }) {

  const lots = await models.lot.findAll();

  return lots ? lots : [];
}

module.exports = {
  currentUser,
  lots
}
