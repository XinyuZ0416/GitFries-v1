const {UserModel} = require('../models.js')

// POST - create
exports.createUser = async (req, res) => {
  try{
    const newUser = new UserModel(req.body)
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  }catch(err){
    console.error('Error creating user:', err)
    res.status(400).send(err)
  }
}

// PUT - update
exports.updateProfileImg = async (req, res) => {
  try{
    const user = await UserModel.findOneAndUpdate(
      {userID: req.params.userID},
      {profileImageUrl: req.file.location},
      { new: true }
    )

    if(!user){
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user });
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.updateUserUrl = async(req,res) => {
  try{
    const updatedUser = await UserModel.findOneAndUpdate( // use findOne instead of findById to match cognito userID
      {userID: req.params.userID}, //filter
      {personalUrl: req.body.personalUrl}, //content
      {new: true}
    )
    if(!updatedUser){
      return res.status(404).send('User information not found')
    }
    res.status(200).json(updatedUser)
  }catch(err){
    console.log(`Error updating UserUrl: ${err}`)
    res.status(500).send(`Error updating UserUrl: ${err}`)
  }
}

exports.updateUserID = async(req,res) => {
  try{
    const updatedUserID = await UserModel.findOneAndUpdate( // use findOne instead of findById to match cognito userID
      {username: req.params.username}, //filter
      {userID: req.body.userID}, //content
      {new: true}
    )
    if(!updatedUserID){
      return res.status(404).send('User information not found')
    }
    res.status(200).json(updatedUserID)
  }catch(err){
    console.log(`Error updating UserID: ${err}`)
    res.status(500).send(`Error updating UserID: ${err}`)
  }
}

exports.updateUsername = async(req, res) => {
  try{
    const updatedUser = await UserModel.findOneAndUpdate(
      {userID: req.params.userID}, //filter
      {username: req.body.username}, //content
      {new: true}
    )
    if(!updatedUser){
      return res.status(404).send('User information not found')
    }
    res.status(200).json(updatedUser)
  }catch(err){
    console.log(`Error updating username: ${err}`)
    res.status(500).send(`Error updating username: ${err}`)
  }
}

exports.addUserFavs = async(req,res) => { //add user faved issue
  try{
    const updatedUserFavs = await UserModel.findOneAndUpdate( // use findOne instead of findById to match cognito userID
      {userID: req.body.userID}, //filter
      {$addToSet: {issuesFavorited: req.body.issueID}}, //content
      {new:true}
    )
    if(!updatedUserFavs){
      return res.status(404).send('User information not found')
    }
    res.json(updatedUserFavs)
  }catch(err){
    console.log(`Error updating userFavs: ${err}`)
    res.status(500).send(`Error updating userFavs: ${err}`)
  }
}

exports.removeUserFavs = async(req,res) => { //remove user faved issue
  try{
    const updatedUserFavs = await UserModel.findOneAndUpdate( // use findOne instead of findById to match cognito userID
      {userID: req.body.userID}, //filter
      {$pull: {issuesFavorited: req.body.issueID}}, //content
      {new: true}
    )
    if(!updatedUserFavs){
      return res.status(404).send('User information not found')
    }
    res.status(200).json(updatedUserFavs)
  }catch(err){
    console.log(`Error updating userFavs: ${err}`)
    res.status(500).send(`Error updating userFavs: ${err}`)
  }
}

exports.addUserPost = async(req,res) => { //add user posted issue
  try{
    const updatedUserPost = await UserModel.findOneAndUpdate(// use findOne instead of findById to match cognito userID
      {userID: req.body.userID}, //filter
      {$addToSet: {issuesPosted: req.body.issueID}} //content
    )
    if(!updatedUserPost){
      return res.status(404).send('User information not found')
    }
    res.json(updatedUserPost)
  }catch(err){
    console.log(`Error updating userPost: ${err}`)
    res.status(500).send(`Error updating userPost: ${err}`)
  }
}

exports.removeUserPost = async(req,res) => { //remove user posted issue
  try{
    const updatedUserPost = await UserModel.findOneAndUpdate( // use findOne instead of findById to match cognito userID
      {userID: req.body.userID}, //filter
      {$pull: {issuesPosted: req.body.issueID}} //content
    )
    if(!updatedUserPost){
      return res.status(404).send('User information not found')
    }
    res.json(updatedUserPost)
  }catch(err){
    console.log(`Error updating userPost: ${err}`)
    res.status(500).send(`Error updating userPost: ${err}`)
  }
}

exports.addUserComment = async(req, res) => {
  try{
    const addedUserComment = await UserModel.findOneAndUpdate( // use findOne instead of findById to match cognito userID
      {userID: req.body.userID}, // filter
      {$addToSet: {commentsAdded: req.body.commentID}} // content
    )

    if(!addedUserComment){
      return res.status(404).send('User comments not found')
    }
    res.json(addedUserComment)
  }catch(err){
    console.log(`Error updating user comments: ${err}`)
    res.status(500).send(`Error updating user comments: ${err}`)
  }
}

exports.removeUserComment = async(req,res) => { //remove user posted comment
  try{
    const removedUserComment = await UserModel.findOneAndUpdate( // use findOne instead of findById to match cognito userID
      {userID: req.body.userID}, //filter
      {$pull: {commentsAdded: req.body.commentID}} //content
    )
    if(!removedUserComment){
      return res.status(404).send('User comments not found')
    }
    res.json(removedUserComment)
  }catch(err){
    console.log(`Error updating user comments: ${err}`)
    res.status(500).send(`Error updating user comments: ${err}`)
  }
}

// GET - read
exports.getUserFavs = async(req, res) => {
  try{
    const userID = req.params.userID
    const userFavs = await UserModel.findOne({userID}, 'issuesFavorited').populate('issuesFavorited')

    if(!userFavs){
      return res.status(404).send('Userfavs not found')
    }
    res.json(userFavs.issuesFavorited)
  }catch (err) {
    console.log(`Error fetching userfavs: ${err}`);
    res.status(500).send(`Error fetching userfavs: ${err}`);
  }
}

exports.getUserWithUsername = async(req, res) => {
  try{
    const user = await UserModel.findOne({ username: req.params.username })
    if(!user){
      return res.status(404).send('User not found')
    }
    res.status(200).json(user)
  }catch (err) {
    console.log(`Error fetching users: ${err}`);
    res.status(500).send(`Error fetching users: ${err}`);
  }
}

exports.getUserWithID = async(req, res) => {
  try{
    const user = await UserModel.find({userID: req.params.userID})
    if(!user){
      return res.status(404).send('User issue not found')
    }
    res.status(200).json(user)
  }catch (err) {
    console.log(`Error fetching user issues: ${err}`)
    res.status(500).send(`Error fetching user issues: ${err}`)
  }
}
