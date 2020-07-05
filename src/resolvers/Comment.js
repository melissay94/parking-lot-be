async function user(comment) {
  const user = comment.getUser();

  if (user) {
    return user;
  } else {
    throw new Error("No user found for this comment");
  }
}

async function entry(comment) {
  const entry = comment.getEntry();

  if(entry) {
    return entry;
  } else {
    throw new Error("No entry found for this comment");
  }
}

module.exports = {
  user,
  entry
};
