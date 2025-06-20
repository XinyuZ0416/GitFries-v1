const {IssueModel} = require('../models.js')
const {countIssuesByTime} = require('../dashboard/countIssuesByTime.js')
const {countIssuesByLanguage} = require('../dashboard/countIssuesByLanguage.js')
const {countIssuesByDifficulty} = require('../dashboard/countIssuesByDifficulty.js')

// POST - create
exports.createIssue = async (req, res) => {
  try{
    const newIssue = new IssueModel(req.body)
    const savedIssue = await newIssue.save()
    console.log('saved issue')
    res.status(201).json(savedIssue)
  }catch(err){
    console.log('error creating issue:', err)
    res.status(400).send(`error creating issue: ${err}`)
  }
}

// GET - read
exports.getIssues = async(req, res) => {
  try{
    const issues = await IssueModel.find().sort({time: -1}) // sort according to time
    res.json(issues)
  }catch(err){
    res.status(500).send(`server error: ${err}`)
  }
}

exports.getIssuesByTime = async(req, res) => { // get issues count by time (year and month)
  try{
    const result = await countIssuesByTime()
    if(!result){
      return res.status(404).send('Issues not found')
    }
    res.status(200).json(result)
  }catch(err){
    console.error('Error counting issues by time:', err)
    res.status(500).json({ error: 'Error counting issues by time' })
  }
}

exports.getIssuesByLanguage = async(req, res) => { // get issues count by language
  try{
    const result = await countIssuesByLanguage()
    if(!result){
      return res.status(404).send('Issues not found')
    }
    res.status(200).json(result)
  }catch(err){
    console.error('Error counting issues by language:', err)
    res.status(500).json({ error: 'Error counting issues by language' })
  }
}

exports.getIssuesByDifficulty = async(req, res) => { // get issues count by language
  try{
    const result = await countIssuesByDifficulty()
    if(!result){
      return res.status(404).send('Issues not found')
    }
    res.status(200).json(result)
  }catch(err){
    console.error('Error counting issues by difficulty:', err)
    res.status(500).json({ error: 'Error counting issues by difficulty' })
  }
}


exports.getIssue = async(req, res) => {
  try{
    const issue = await IssueModel.findById(req.params.id)
    if(!issue){
      return res.status(400).send('Issue not found')
    }
    res.json(issue)
  }catch(err){
    res.status(500).send(`server error: ${err}`)
  }
}

exports.getIssuesBasedOnFilter = async (req, res) => {
  try {
    const { language, difficulty, isUrgent } = req.query

    // build query
    const query = {}
    if(language) query.language = language
    if (difficulty) query.difficulty = difficulty
    if (isUrgent) query.isUrgent = isUrgent 

    const filteredIssues = await IssueModel.find(query)

    if (filteredIssues.length === 0) {
      return res.status(404).send('Issues not found')
    }

    res.status(200).json(filteredIssues)
  } catch (err) {
    console.log(`Error fetching Issues: ${err}`)
    res.status(500).send(`Error fetching Issues: ${err}`)
  }
}

exports.getIssueFavedBy = async(req, res) => {
  try{
    const favedBy = await IssueModel.findById(req.params.issueID).select('favoritedBy')
    if(!favedBy) return res.status(404).select('faved by not found')
    res.status(200).json(favedBy)
  }catch (err) {
    console.log(`Error fetching Issue faved by: ${err}`)
    res.status(500).send(`Error fetching Issue faved by: ${err}`)
  }
}

// PUT - update
exports.updateUsername = async(req, res) => {
  try{
    const updatedUsername = await IssueModel.findByIdAndUpdate(
      req.params.issueID, //filter
      {username: req.body.username}, //content
      { new: true} 
    )

    if(!updatedUsername){
      return res.status(404).send('Issue information not found')
    }
    res.json(updatedUsername)
  }catch(err){
    console.log(`Error updating username: ${err}`)
    res.status(500).send(`Error updating username: ${err}`)
  }
}

exports.updateFavedBy = async(req, res) => {
  try{
    const updatedFavedBy = await IssueModel.findByIdAndUpdate(
      req.params.issueID, //filter
      {$addToSet: {favoritedBy: req.body.userID}}, //content
      { new: true} 
    )

    if(!updatedFavedBy){
      return res.status(404).send('Issue information not found')
    }
    res.json(updatedFavedBy)
  }catch(err){
    console.log(`Error updating favoritedBy: ${err}`)
    res.status(500).send(`Error updating favoritedBy: ${err}`)
  }
}

exports.addCommentID = async(req, res) => {
  try{
    const addedCommentID = await IssueModel.findByIdAndUpdate(
      req.params.issueID, //filter
      {$addToSet: {commentIDs: req.body.commentID}}, //content
      { new: true }
    )

    if(!addedCommentID){
      return res.status(404).send('Comment information not found')
    }
    res.json(addedCommentID)
  }catch(err){
    console.log(`Error adding commentIDs: ${err}`)
    res.status(500).send(`Error adding commentIDs: ${err}`)
  }
}

exports.removeCommentID = async(req, res) => {
  try{
    const removedCommentID = await IssueModel.findByIdAndUpdate(
      req.params.issueID, //filter
      {$pull: {commentIDs: req.body.commentID}}, //content
      { new: true} 
    )

    if(!removedCommentID){
      return res.status(404).send('Comment information not found')
    }
    res.json(removedCommentID)

  }catch(err){
    console.log(`Error removing commentIDs: ${err}`)
    res.status(500).send(`Error removing commentIDs: ${err}`)
  }
}

// DELETE 
exports.deleteIssue = async(req, res) => {
  try{
    const deletedIsuue = await IssueModel.findByIdAndDelete(req.params.issueID)
    if(!deletedIsuue){
      return res.status(404).send('Issue-to-delete not found')
    }
    res.json({message: 'Issue deleted successfully'})
  }catch(err){
    res.status(500).send(`Error deleting issue: ${err}`)
  }
}