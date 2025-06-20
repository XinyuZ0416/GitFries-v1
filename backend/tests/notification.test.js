const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const { NotificationModel }  = require('../models');

describe('Notification API', () => {
  beforeAll(async () => {
    await NotificationModel.deleteMany({})
  })

  afterAll(async () => {
    await NotificationModel.deleteMany({})
    mongoose.connection.close()
  })

  const testNotification = 
  {
    userID: "user123",  
    issueID: "issue456",   
    commentID: "comment789",    
    commentUsername: "JohnDoe",   
    parentCommentID: null,   
    isRead: false,  
    time: new Date("2024-07-04T08:30:00Z")
  }

  test('create a notification', async () => {
    const response = await request(app)
      .post('/api/notification/create')
      .send(testNotification)
      .expect(200)
  })

  test('get notifications for a user', async () => {
    const response = await request(app)
      .get(`/api/notifications/${testNotification.userID}`)
      .expect(200)

    expect(response.body.length).toBeGreaterThan(0)
  })

  test('get unread notifications for a user', async () => {
    const response = await request(app)
      .get(`/api/unreadNotifications/${testNotification.userID}`)
      .expect(200)

    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0].isRead).toBe(false)
  })

  test('mark a notification as read', async () => {
    const notification = new NotificationModel({
      userID: "user123",  
      issueID: "issue456",   
      commentID: "comment789",    
      commentUsername: "JohnDoe",   
      parentCommentID: null,   
      isRead: false,  
      time: new Date("2024-07-04T08:30:00Z")
    })
    const savedNotification = await notification.save()

    const response = await request(app)
      .put(`/api/markNotificationRead/${savedNotification._id}`)
      .send({ isRead: true })
      .expect(200)

    expect(response.body.isRead).toBe(true)
  })
})

