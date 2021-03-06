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

async function entry(root, { id }, { models }) {

  const entry = await models.entry.findOne({
    where: {
      id
    }
  });

  if (!entry) {
    throw new Error("Entry not found");
  }

  return entry;
}

async function entries(root, args, { models }) {
  
  const entries = await models.entry.findAll();

  return entries ? entries : [];
}

async function comment(root, { id }, { models }) {
  const comment = await models.comment.findOne({
    where: {
      id
    }
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  return comment;
}

async function comments(root, args, { models }) {
  const comments = await models.comment.findAll();

  return comments ? comments : [];
}

module.exports = {
  currentUser,
  lot,
  lots,
  entry,
  entries,
  comment,
  comments
}
