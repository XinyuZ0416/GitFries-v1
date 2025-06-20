const mongoose = require('mongoose')
const { Schema } = mongoose

// aboutme
const aboutmeSchema = new mongoose.Schema(
  {
    userID: {type: String, required: true},
    content: {type: String, required: true}
  }
)
const AboutMeModel = mongoose.model('aboutme', aboutmeSchema)

// issue
const issueSchema = new mongoose.Schema(
  {
    userID: {type: String, required: true},
    username: {type: String, required: true},
    issueURL:{type: String, required: true},
    title: {type: String, required: true},
    description: {type: String},
    language: {type: String, required: true},
    customLanguage: {type: String},
    difficulty: {type: String, required: true},
    isUrgent: {type: Boolean},
    time:{type: Date, default: Date.now},
    favoritedBy:[{type: String, ref: 'user'}],
    commentIDs:[{type: String, ref: 'comment'}]
  }
)
const IssueModel = mongoose.model('issue',issueSchema)

// user
const userSchema = new mongoose.Schema(
  {
    userID: {type: String},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    issuesPosted: [{ type: Schema.Types.ObjectId, ref: 'issue' }],
    issuesFavorited: [{ type: Schema.Types.ObjectId, ref: 'issue' }],
    commentsAdded: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
    profileImageUrl: { type: String, default: 'https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png' },
    personalUrl:{type: String, default: ''}
  }
)
const UserModel = mongoose.model('user', userSchema)

// comment
const commentSchema = new mongoose.Schema(
  {
    userID: {type: String, ref: 'user'},
    username: {type: String, ref: 'user'},
    issueID: {type: String, ref: 'issue'},
    content: { type: String, required: true },
    time:{type: Date, default: Date.now},
    parentCommentID: { type: String, ref: 'comment', default: null },
    nestedComments: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
  }
)
const CommentModel = mongoose.model('comment', commentSchema)

// notification
const notificationSchema = new mongoose.Schema(
  {
    userID: {type: String, ref:'user'},
    issueID: {type: String, ref:'issue'},
    commentID: {type: String, ref:'comment'},
    commentUsername: {type: String, ref: 'user'},
    parentCommentID: {type: String, default: null, ref:'comment'},
    isRead: { type: Boolean, default: false },
    time:{type: Date, default: Date.now}
  }
)
const NotificationModel = mongoose.model('notification', notificationSchema)

module.exports = {
  AboutMeModel,
  IssueModel,
  UserModel,
  CommentModel,
  NotificationModel
}