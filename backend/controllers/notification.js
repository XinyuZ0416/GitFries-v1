const {NotificationModel} = require('../models.js')

// POST - create
exports.createNotification = async(req, res) => {
  try{
    const newNotification = new NotificationModel(req.body)
    const savedNotification = await newNotification.save()
    
    res.status(200).json(savedNotification)
  }catch(err){
    console.log('error creating notification:', err)
    res.status(400).send(`error creating notification: ${err}`)
  }
}

// GET
exports.getNotifications = async(req, res) => {
  try{
    const fetchedNotifications = await NotificationModel.find({userID: req.params.userID})
    if(!fetchedNotifications){
      return res.status(404).send('Notifications not found')
    }
    res.status(200).json(fetchedNotifications)
  }catch(err){
    console.log(`Error fetching notifications: ${err}`)
    res.status(500).send(`Error fetching notifications: ${err}`)
  }
}

exports.getUnreadNotifications = async(req, res) => {
  try{
    const fetchedUnreadNotifications = await NotificationModel.find({
      userID: req.params.userID,
      isRead: false
    })
    if(!fetchedUnreadNotifications){
      return res.status(404).send('Notifications not found')
    }
    res.status(200).json(fetchedUnreadNotifications)
  }catch(err){
    console.log(`Error fetching unread notifications: ${err}`)
    res.status(500).send(`Error fetching unread notifications: ${err}`)
  }
}

// PUT - update
exports.setNotificationRead = async(req, res) => {
  try{
    const updatedUnreadNotifications = await NotificationModel.findByIdAndUpdate(
      req.params.notificationID,
      { isRead: true },
      { new: true }
    )
    if(!updatedUnreadNotifications){
      return res.status(404).send('Notifications not updated')
    }
    res.status(200).json(updatedUnreadNotifications)
  }catch(err){
    console.log(`Error updating unread notifications: ${err}`)
    res.status(500).send(`Error updating unread notifications: ${err}`)
  }
}

// DELETE
exports.deleteNotificationsByComment = async(req, res) => {
  try {
    const result = await NotificationModel.deleteMany(req.params.commentID)
    res.status(200).json({ message: 'All notifications have been deleted', result });
  } catch (err) {
    console.error(`Error deleting all notifications: ${err}`);
    res.status(500).json({ error: 'Failed to delete all notifications' });
  }
}