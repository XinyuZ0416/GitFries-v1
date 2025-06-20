/**
 * for deleting data during dev
 */

const { IssueModel, UserModel, CommentModel, NotificationModel } = require('../models')

// 1. Delete all comments
exports.deleteAllComments = async (req, res) => {
  try {
    // Delete all documents in the comments collection
    const result = await CommentModel.deleteMany({});

    res.status(200).json({ message: 'All comments have been deleted', result });
  } catch (err) {
    console.error(`Error deleting all comments: ${err}`);
    res.status(500).json({ error: 'Failed to delete all comments' });
  }
};

// 2. Delete all commentIDs in Issue schema
exports.deleteAllIssueComments = async (req, res) => {
  try {
    // Update all issues by setting commentIDs to an empty array
    const result = await IssueModel.updateMany({}, { $set: { commentIDs: [] } });

    res.status(200).json({ message: 'All commentIDs in Issue schema have been deleted', result });
  } catch (err) {
    console.error(`Error deleting commentIDs in Issue schema: ${err}`);
    res.status(500).json({ error: 'Failed to delete commentIDs in Issue schema' });
  }
};

// 3. Delete all commentsAdded in User schema
exports.deleteAllUserCommentsAdded = async (req, res) => {
  try {
    // Update all users by setting commentsAdded to an empty array
    const result = await UserModel.updateMany({}, { $set: { commentsAdded: [] } });

    res.status(200).json({ message: 'All commentsAdded in User schema have been deleted', result });
  } catch (err) {
    console.error(`Error deleting commentsAdded in User schema: ${err}`);
    res.status(500).json({ error: 'Failed to delete commentsAdded in User schema' });
  }
};

// 4. Delete all notifications
exports.deleteAllNotifications = async (req, res) => {
  try {
    // Delete all documents in the comments collection
    const result = await NotificationModel.deleteMany({});

    res.status(200).json({ message: 'All notification have been deleted', result });
  } catch (err) {
    console.error(`Error deleting all notification: ${err}`);
    res.status(500).json({ error: 'Failed to delete all notification' });
  }
};