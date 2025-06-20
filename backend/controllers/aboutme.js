const {AboutMeModel} = require('../models.js')

// POST - create
exports.createAboutMe = async (req, res) => {
  try{
    const newAboutMe = new AboutMeModel(req.body)
    const savedAboutMe = await newAboutMe.save()
    res.status(201).json(savedAboutMe)
  }catch(err){
    console.log('error creating about me:', err)
    res.status(400).send(`error creating aboutme: ${err}`)
  }
}

// GET - read one
exports.getAboutMe = async(req, res) => {
  try{
    const aboutMe = await AboutMeModel.findOne({userID: req.params.userId})

    if(!aboutMe){
      return res.status(404).send('About Me information not found')
    }
    res.json(aboutMe)
  }catch(err){
    console.log(`Error fetching About Me: ${err}`)
    res.status(500).send(`Error fetching About Me: ${err}`)
  }
}

// PUT - update
exports.updateAboutMe = async(req,res) => {
  try{
    const updatedAboutMe = await AboutMeModel.findOneAndUpdate(
      {userID: req.params.userId}, //filter
      {content: req.body.content}, //content
      { new: true }
    )
    if(!updatedAboutMe){
      return res.status(404).send('About Me information not found')
    }
    res.status(200).json(updatedAboutMe)
  }catch(err){
    console.log(`Error updating About Me: ${err}`)
    res.status(500).send(`Error updating About Me: ${err}`)
  }
}

