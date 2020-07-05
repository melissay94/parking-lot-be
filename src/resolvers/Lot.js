async function users(lot) {
  const users = await lot.getUsers();

  if (users) {
    return users;
  } else {
    throw new Error("No users found for this lot");
  }
}

async function entries(lot) {
  const entries = await lot.getEntries();

  if (entries) {
    return entries;
  } else {
    throw new Error("No entries were found for this lot");
  }
}

async function author(lot) {
  const author = await lot.getAuthor();

  if (author) {
    return author;
  } else {
    throw new Error("No author found for this lot");
  }
}

module.exports = {
  users,
  entries, 
  author
};
