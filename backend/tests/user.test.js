const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const { UserModel } = require('../models'); 
const { Types } = require('mongoose');
const ObjectId = Types.ObjectId;


describe('User API', () => {
  beforeAll(async () => {
    await UserModel.deleteMany({})
  })

  afterAll(async () => {
    await UserModel.deleteMany({})
    mongoose.connection.close()
  })

  test('create a new user', async () => {
    const newUser = {
      username: 'john_doe',
      email: 'john.doe@example.com',
      issuesPosted: [],
      issuesFavorited: [],
      commentsAdded: [],
      profileImageUrl: 'https://example.com/profile/john_doe.jpg'
    }

    const response = await request(app)
      .post('/api/signup')
      .send(newUser)
      .expect(201)

    expect(response.body).toHaveProperty('_id')
    expect(response.body.username).toBe(newUser.username)
    expect(response.body.email).toBe(newUser.email)
  })

  test('update user ID', async () => {
    const user = new UserModel ({
      username: 'abcdefghijklmn',
      email: 'john.doe@example.com',
      issuesPosted: [],
      issuesFavorited: [],
      commentsAdded: [],
      profileImageUrl: 'https://example.com/profile/john_doe.jpg'
    })
    const savedUser = await user.save()
    const newUserID = '123'
  
    const response = await request(app)
      .put(`/api/useridupdate/${savedUser.username}`)
      .send({ userID: newUserID })
      .expect(200)
  
    expect(response.body.userID).toBe(newUserID)
  })

  test('remove user favorite issue', async () => {
    const user = new UserModel ({
      userID:'userabcid',
      username: 'abc',
      email: 'abc@example.com',
      issuesPosted: [],
      issuesFavorited: [new ObjectId('6157f5eb6f7e4e001e8b2d68')],
      commentsAdded: [],
      profileImageUrl: 'https://example.com/profile/john_doe.jpg'
    })
    const savedUser = await user.save()
  
    await request(app)
      .put(`/api/userfavsremove/${savedUser.userID}`)
      .send({ issueID: '6157f5eb6f7e4e001e8b2d68' })
      .expect(200)
  })

  test('get user by username', async () => {
    const user = new UserModel ({
      username: 'testuser',
      email: 'testuser@example.com',
      issuesPosted: [],
      issuesFavorited: [],
      commentsAdded: [],
      profileImageUrl: 'https://example.com/profile/john_doe.jpg'
    })
    const savedUser = await user.save()
  
    const response = await request(app)
      .get(`/api/user/${savedUser.username}`)
      .expect(200)
  
    expect(response.body.username).toBe(savedUser.username)
  })

  test('get user by ID', async () => {
    const user = new UserModel ({
      userID: 'user123',
      username: 'testuser123',
      email: 'testuser@example.com',
      issuesPosted: [],
      issuesFavorited: [],
      commentsAdded: [],
      profileImageUrl: 'https://example.com/profile/john_doe.jpg'
    })
    const savedUser = await user.save()
  
    const response = await request(app)
      .get(`/api/userByID/${savedUser.userID}`)
      .expect(200);
  
    expect(response.body[0].userID).toBe(savedUser.userID)
  })

  test('update username', async () => {
    const user = new UserModel ({
      userID: 'testuserabc',
      username: 'testuserabc',
      email: 'testuser@example.com',
      issuesPosted: [],
      issuesFavorited: [],
      commentsAdded: [],
      profileImageUrl: 'https://example.com/profile/john_doe.jpg'
    })
    const savedUser = await user.save()

    const newUsername = 'newusername';
  
    const response = await request(app)
      .put(`/api/usernameupdate/${savedUser.userID}`)
      .send({ username: newUsername })
      .expect(200);
  
    expect(response.body.username).toBe(newUsername)
  
    // Verify the updated user record in the database
    const updatedUser = await UserModel.findOne({ userID: savedUser.userID })
    expect(updatedUser.username).toBe(newUsername)
  })
})
