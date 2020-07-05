async function comments(entry) {
  const comments = await entry.getComments();

  if(comments) {
    return comments;
  } else {
    throw new Error("No comments found on this entry");
  }
}

async function author(entry) {
  const author = await entry.getUser();

  if (author) {
    return author;
  } else {
    throw new Error("No author found for this entry");
  }
}

async function lot(entry) {
  const lot = await entry.getLot();

  if (lot) {
    return lot;
  } else {
    throw new Error("No lot found for this entry");
  }
}

module.exports = {
  comments,
  author,
  lot
};
