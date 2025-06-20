const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 1234
const mongoose = require('mongoose')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const multer = require('multer')
const multerS3 = require('multer-s3')
const aboutmeController = require('./controllers/aboutme.js')
const issueController = require('./controllers/issue.js')
const userController = require('./controllers/user.js')
const commentController = require('./controllers/comment.js')
const notificationController = require('./controllers/notification.js')
const testAssistController = require('./controllers/testassist.js')
const dotenv = require('dotenv')
dotenv.config()

// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

// MongoDB Connection Details 
const dbURI = process.env.MONGO_DBURI
// const dbURI = 'mongodb://localhost:27017/GitFries';

// connect to MongoDB
mongoose.connect(dbURI)
        .then(() => {
          console.log('connected to mongo db')
          // start server after successful connection
          app.listen(PORT, () => console.log(`listening on port ${PORT}`))
        })
        .catch((err) => console.log(`failed to connect to mongodb, ${err}`))

// configure aws sdk v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

// configure multer to use S3 for storage
const upload = multer({
  storage:multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function(req, file,cb){
      cb(null, `profile-images/${Date.now()}_${file.originalname}`)
    }
  })
})

// test assist routes
app.delete('/api/deleteAllComments', testAssistController.deleteAllComments);// Delete all comments
app.delete('/api/deleteAllCommentsInIssueDB', testAssistController.deleteAllIssueComments);// Delete all commentIDs in Issue DB
app.delete('/api/deleteAllCommentsInUserDB', testAssistController.deleteAllUserCommentsAdded);// Delete all commentsAdded in User DB
app.delete('/api/deleteAllNotifications', testAssistController.deleteAllNotifications)

// about me routes
app.post('/api/aboutmecreate', aboutmeController.createAboutMe)
app.get('/api/aboutme/:userId',aboutmeController.getAboutMe)
app.put('/api/aboutmeupdate/:userId', aboutmeController.updateAboutMe)

// issue routes
app.post('/api/issuecreate', issueController.createIssue)
app.get('/api/issues', issueController.getIssues)
app.get('/api/issues/countByTime', issueController.getIssuesByTime)
app.get('/api/issues/countByLanguage', issueController.getIssuesByLanguage)
app.get('/api/issues/countByDifficulty', issueController.getIssuesByDifficulty)
app.get('/api/issues/filter', issueController.getIssuesBasedOnFilter)
app.get('/api/issue/:id', issueController.getIssue)
app.get('/api/issuefavedby/:issueID', issueController.getIssueFavedBy)
app.put('/api/issues/:issueID/favorite', issueController.updateFavedBy)
app.put('/api/issues/commentadd/:issueID', issueController.addCommentID)
app.put('/api/issues/commentremove/:issueID', issueController.removeCommentID)
app.delete('/api/issue/delete/:issueID', issueController.deleteIssue)
app.put('/api/updateIssueUsername/:issueID', issueController.updateUsername)

// user routes
app.post('/api/signup', userController.createUser)
app.put('/api/useridupdate/:username',userController.updateUserID)
app.put('/api/userUrlupdate/:userID',userController.updateUserUrl)
app.put('/api/userfavsadd/:userID', userController.addUserFavs)
app.put('/api/userfavsremove/:userID', userController.removeUserFavs)
app.get('/api/userfavs/:userID', userController.getUserFavs)
app.put('/api/userpostadd/:userID', userController.addUserPost)
app.put('/api/userpostremove/:userID', userController.removeUserPost)
app.put('/api/user/commentadd/:userID', userController.addUserComment)
app.put('/api/user/commentremove/:userID', userController.removeUserComment)
app.get('/api/user/:username',userController.getUserWithUsername)
app.get('/api/userByID/:userID', userController.getUserWithID)
app.put('/api/usernameupdate/:userID',userController.updateUsername)
app.put('/api/userpicupload/:userID', upload.single('profileImage'), userController.updateProfileImg)

// comment routes
app.get('/api/comments/:issueID', commentController.getCommentsByIssue)
app.get('/api/singleComment/:commentID', commentController.getComment)
app.post('/api/commentcreate', commentController.createComment)
app.put('/api/parentCommentIDAdd/:commentID', commentController.addParentCommentID)
app.put('/api/comment/addnested/:commentID', commentController.addNestedComment)
app.delete('/api/comment/delete/:commentID', commentController.deleteComment) // delete single comment by id
app.delete('/api/comments/delete/:issueID', commentController.deleteComments) // delete all comments by issue
app.delete('/api/comment/deletenested/:commentID', commentController.deleteCommentAndNestedComments) // delete comment & its nested comments
app.put('/api/updateCommentUsername/:commentID', commentController.updateUsername)

// notification routes
app.post('/api/notification/create', notificationController.createNotification)
app.get('/api/notifications/:userID', notificationController.getNotifications)
app.get('/api/unreadNotifications/:userID', notificationController.getUnreadNotifications)
app.put('/api/markNotificationRead/:notificationID', notificationController.setNotificationRead)

module.exports = app