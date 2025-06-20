const {CommentModel, IssueModel, UserModel} = require('../models.js')

// POST - create
exports.createComment = async (req, res) => {
  try{
      const newComment = new CommentModel(req.body)
      const savedComment = await newComment.save()
      console.log('posted comment')
      res.status(200).json(savedComment)
    }catch(err){
      console.log('error creating comment:', err)
      res.status(400).send(`error creating comment: ${err}`)
    }
}

// PUT - update
exports.updateUsername = async(req, res) => {
  try{
    const updatedUsername = await CommentModel.findByIdAndUpdate(
      req.params.commentID, //filter
      {username: req.body.username}, //content
      { new: true }
    )

    if(!updatedUsername){
      return res.status(404).send('Comment information not found')
    }
    res.status(200).json(updatedUsername)
  }catch(err){
    console.log(`Error updating username: ${err}`)
    res.status(500).send(`Error updating username: ${err}`)
  }
}

// GET - read
exports.getCommentsByIssue = async(req, res) => {
  try{
    const comments = await CommentModel.find({issueID: req.params.issueID}).sort({time: -1})// sort according to time
    if(!comments){
      return res.status(404).send('Comments not found')
    }
    res.status(200).json(comments)
  }catch(err){
    res.status(500).send(`server error: ${err}`)
  }
}

exports.getComment = async(req, res) => {
  try{
    const comment = await CommentModel.findById(req.params.commentID)
    if(!comment){
      return res.status(404).send('Comment not found')
    }
    res.status(200).json(comment)
  }catch(err){
    res.status(500).send(`server error: ${err}`)
  }
}

// PUT - update
exports.addParentCommentID = async(req, res) => {
  try{
    const addedParentCommentID = await CommentModel.findByIdAndUpdate(
      req.params.commentID,
      {parentCommentID: req.body.parentCommentID}
    )
    if(!addedParentCommentID){
      return res.status(404).send('addedParentCommentID not found')
    }
    res.status(200).json(addedParentCommentID)
  }catch(err){
    res.status(500).send(`server error: ${err}`)
  }
}

exports.addNestedComment = async(req, res) => {
  try{
    const updatedNestedComments = await CommentModel.findByIdAndUpdate(
      req.params.commentID,
      {$push: {nestedComments: req.body.nestedCommentID}}
    )
    if(!updatedNestedComments){
      return res.status(404).send('updatedNestedComments not found')
    }
    res.status(200).json(updatedNestedComments)
  }catch(err){
    res.status(500).send(`server error: ${err}`)
  }
}

// DELETE 
exports.deleteComment = async(req, res) => { // delete single comment by id
  try{
    const deletedComment = await CommentModel.findByIdAndDelete(req.params.commentID)
    if(!deletedComment){
      return res.status(404).send('Comment-to-delete not found')
    }
    res.json({message: 'Comment deleted successfully'})
  }catch(err){
    res.status(500).send(`Error deleting comment: ${err}`)
  }
}

exports.deleteComments = async(req, res) => { // delete all comments by issue
  try{
    const deletedComments = await CommentModel.deleteMany({
      issueID: req.params.issueID // filter
    })
    if(!deletedComments){
      return res.status(404).send('Comments-to-delete not found')
    }
    res.json({message: 'Comment deleted successfully'})
  }catch(err){
    res.status(500).send(`Error deleting comments: ${err}`)
  }
}

/**
 * _______________________________________________________________________
 * recursively delete comments while updating commentdb, issuedb, userdb relavant fields
 */ 
// collect all comment IDs that need to be deleted, including root comment and all its nested comments
const collectCommentsToDelete = async (commentID) => {
  const commentsToDelete = []

  const collect = async (id) => {
    const comment = await CommentModel.findById(id)
    if (!comment) return

    commentsToDelete.push(id) // add current commentID to commentsToDelete 

    for (const nestedCommentID of comment.nestedComments) {
      await collect(nestedCommentID) // add nested commentID to commentsToDelete 
    }
  }

  await collect(commentID) // initial call
  return commentsToDelete
}

// update issuedb commentIDs field
const updateIssueCommentIDs = async (issueID, commentsToDelete) => {
  await IssueModel.findByIdAndUpdate(
    issueID,
    { $pull: { commentIDs: { $in: commentsToDelete } } } // remove commentID if it matches any value in the commentsToDelete array
  )
}

// update userdb commentsAdded field
const updateUserCommentsAdded = async(userID, commentsToDelete) => {
  await UserModel.findOneAndUpdate(
    {userID}, // wrap inside {} to avoid ObjectParameterError because userID is a string representing Cognito UserID
    {$pull: { commentsAdded: {$in: commentsToDelete}}}
  )
  console.log(commentsToDelete)
}

// actually delete comments
const deleteComments = async (commentsToDelete) => {
  await CommentModel.deleteMany({ _id: { $in: commentsToDelete } })// delete if it matches any value in the commentsToDelete array
}

const deleteNestedCommentsRecursively = async (commentID, issueID, userID) => {
  try {
    const commentsToDelete = await collectCommentsToDelete(commentID)

    // update the issue's commentIDs to remove all relevant comments
    await updateIssueCommentIDs(issueID, commentsToDelete)

    // update the users's commentsAdded to remove all relevant comments
    await updateUserCommentsAdded(userID, commentsToDelete)

    // delete all collected comments
    await deleteComments(commentsToDelete)
  } catch (err) {
    console.log(`Error deleting comments: ${err}`)
  }
}

exports.deleteCommentAndNestedComments = async (req, res) => {
  try {
    await deleteNestedCommentsRecursively(req.params.commentID, req.body.issueID, req.body.userID)
    res.status(200).send('Comments deleted successfully')
  } catch (err) {
    res.status(500).send(`Server error: ${err}`)
  }
}
// _______________________________________________________________________