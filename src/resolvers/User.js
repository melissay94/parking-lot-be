async function lots(user) {
  const lots = await user.getLots();

  if (lots) {
    return lots;
  } else {
    throw new Error("No lots found for this user");
  }
}

async function createdLots(user) {
  const createdLots = await user.getCreatedLots();
  
  if (createdLots) {
    return createdLots;
  } else {
    throw new Error("No created lots found for this user")
  }
}

async function comments(user) {
  const comments = await user.getComments();

  if (comments) {
    return comments;
  } else {
    throw new Error("No comments found for this user");
  }
}

async function entries(user) {
  const entries = await user.getEntries();

  if (entries) {
    return entries;
  } else {
    throw new Error("No entries found for this user");
  }
}

module.exports = {
  lots,
  createdLots,
  comments,
  entries
}
