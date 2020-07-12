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

async function lots(root, args, { currentUser, models }) {

  const lots = await models.lot.findAll();

  return lots ? lots : [];
}

module.exports = {
  currentUser,
  lots
}
