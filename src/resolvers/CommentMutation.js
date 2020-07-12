async function addCommentToEntry(root, { entryId, text}, { currentUser, models }) {

  const entry = await models.entry.findOne({
    where: {
      id: entryId
    }
  });

  if (!entry) {
    throw new Error("Could not find entry to add commment to.");
  }

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error(`Could not find user to add comment to ${entry.title}.`);
  }

  const comment = await models.comment.create({
    text,
    userId: user.id,
    entryId: entry.id
  });

  if (!comment) {
    throw new Error(`Could not add comment to ${entry.title} for ${user.email}`);
  }

  return comment;
}

async function editComment(root, { id, text }, { currentUser, models }) {

  const comment = await models.comment.findOne({
    where: {
      id
    }
  });

  if (!comment) {
    throw new Error("Could not find comment to update.");
  }

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error("Could not find user to update comment.");
  }

  if (user.id !== comment.userId) {
    throw new Error(`${user.email} is not the author of this comment. Cannot update.`);
  }

  const updatedComment = await comment.update({
    text: text || comment.text
  });

  if (!updatedComment) {
    throw new Error(`Could not update ${user.email}'s comment.`);
  }

  return updatedComment;

}

async function deleteComment(root, { id }, { currentUser, models }) {

  const comment = await models.comment.findOne({
    where: {
      id
    }
  });

  if (!comment) {
    throw new Error("Could not find comment to delete it.");
  }

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error("Could not find user to delete comment.");
  }

  if (user.id !== comment.userId) {
    throw new Error(`${user.email} is not the author of this comment. Cannot delete commet.`);
  }

  const deletedComment = await models.comment.destroy({
    where: {
      id: comment.id
    }
  });

  return deletedComment > 0;

}

module.exports = {
  addCommentToEntry,
  editComment,
  deleteComment
};
