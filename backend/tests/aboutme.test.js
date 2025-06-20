const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { AboutMeModel } = require('../models'); 
const dotenv = require('dotenv')
dotenv.config()

describe('About Me API', () => {
  let testUserId
  
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI);
    console.log('connected db for testing')
  })

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('closed db for testing')
  })

  beforeEach(async () => {
    await AboutMeModel.deleteMany({})
  })

  describe('POST /api/aboutmecreate', () => {
    test('create a new AboutMe entry', async () => {
      const newAboutMe = { userID: 'testUser123', content: 'This is a test about me.' }

      const response = await request(app)
        .post('/api/aboutmecreate')
        .send(newAboutMe)
        .expect(201)

      expect(response.body.userID).toBe('testUser123')
      expect(response.body.content).toBe('This is a test about me.')
      testUserId = response.body.userID
    })

    test('return 400 on invalid input', async () => {
      const response = await request(app)
        .post('/api/aboutmecreate')
        .send({})
        .expect(400)

      expect(response.text).toContain('error creating aboutme')
    })
  })

  describe('GET /api/aboutme/:userId', () => {
    test('get AboutMe information by userId', async () => {
      const aboutMeData = { userID: 'testUser456', content: 'Another test about me.' }
      await AboutMeModel.create(aboutMeData)

      const response = await request(app)
        .get(`/api/aboutme/${aboutMeData.userID}`)
        .expect(200)

      expect(response.body.userID).toBe('testUser456')
      expect(response.body.content).toBe('Another test about me.')
    })

    test('return 404 if AboutMe information not found', async () => {
      const response = await request(app)
        .get('/api/aboutme/nonexistentUser')
        .expect(404)

      expect(response.text).toContain('About Me information not found')
    })
  })

  describe('PUT /api/aboutmeupdate/:userId', () => {
    test('update AboutMe information by userId', async () => {
      const aboutMeData = { userID: 'testUser789', content: 'Original about me content.' }
      await AboutMeModel.create(aboutMeData)

      const updatedContent = 'Updated about me content.'
      const response = await request(app)
        .put(`/api/aboutmeupdate/${aboutMeData.userID}`)
        .send({ content: updatedContent })
        .expect(200)

      expect(response.body.userID).toBe('testUser789')
      expect(response.body.content).toBe(updatedContent)
    })

    test('return 404 if AboutMe information not found', async () => {
      const response = await request(app)
        .put('/api/aboutmeupdate/nonexistentUser')
        .send({ content: 'Update attempt' })
        .expect(404)

      expect(response.text).toContain('About Me information not found')
    })
  })
})