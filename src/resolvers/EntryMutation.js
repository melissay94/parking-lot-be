async function addEntryToLot(root, { lotId, title, description, type }, { currentUser, models }) {
  const lot = await models.lot.findOne({
    where: {
      id: lotId
    }
  });

  if (!lot) {
    throw new Error(`Could not find lot to add ${title} entry.`);
  }

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error(`Could not find author to add ${title} entry to ${lot.name}`);
  }

  const entry = await models.entry.create({
    title,
    description,
    type,
    lotId: lot.id,
    userId: user.id
  });

  if (!entry) {
    throw new Error(`Could not add ${title} entry to ${lot.name} by ${user.email}`);
  }

  return entry;
}

async function editEntry(root, { id, title, description }, { currentUser, models }) {

  const entry = await models.entry.findOne({
    where: {
      id
    }
  });

  if (!entry) {
    throw new Error("Could not find entry to update.");
  }

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error(`Could not find user to update ${entry.title}`);
  }

  if (user.id !== entry.userId) {
    throw new Error(`${user.email} is not the author of ${entry.title} entry. Cannot update.`);
  }

  const updatedEntry = await entry.update({
    title: title || entry.title,
    description: description || entry.description
  });

  if (!updatedEntry) {
    throw new Error(`Could not update ${entry.title} for ${user.email}.`);
  }

  return updatedEntry;
}

async function deleteEntry(root, { id }, { currentUser, models }) {

  const entry = await models.entry.findOne({
    where: {
      id
    }
  });

  if (!entry) {
    throw new Error("Could not find entry for deletion.");
  }

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error(`Could not find user to delete ${entry.title} entry.`);
  }

  if (user.id !== entry.userId) {
    throw new Error(`${user.email} is not the author of ${entry.title}. Cannot delete.`);
  }

  const deletedEntry = await models.entry.destroy({
    where: {
      id: entry.id
    }
  });

  return deletedEntry > 0;

}

module.exports = {
  addEntryToLot, 
  editEntry,
  deleteEntry
};
