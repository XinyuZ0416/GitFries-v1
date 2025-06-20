const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const { IssueModel } = require('../models'); 

describe('Issue API', () => {
  beforeAll(async () => {
    await IssueModel.deleteMany({})
  })

  afterAll(async () => {
    await IssueModel.deleteMany({})
    mongoose.connection.close()
  })

  let issueID
  const testIssue = {
    userID: "testUser123",
    username: "testUser",
    issueURL: "http://example.com/issue",
    title: "Test Issue",
    description: "This is a test issue",
    language: "JavaScript",
    customLanguage: "",
    difficulty: "Easy",
    isUrgent: false,
    favoritedBy: [],
    commentIDs: []
  }

  test('create an issue', async () => {
    const response = await request(app)
      .post('/api/issuecreate')
      .send(testIssue)
      .expect(201)

    expect(response.body).toMatchObject(testIssue)
    issueID = response.body._id
  })

  test('get all issues', async () => {
    const response = await request(app)
      .get('/api/issues')
      .expect(200)

    expect(response.body.length).toBeGreaterThan(0)
  })

  test('get issue by id', async () => {
    const issue = new IssueModel({
      userID: 'testUser123',
      username: 'testUser',
      issueURL: 'https://github.com/testUser/testRepo/issues/123',
      title: 'Dummy Issue for Testing',
      description: 'This is a dummy issue created for testing purposes.',
      language: 'JavaScript',
      customLanguage: '',
      difficulty: 'Medium',
      isUrgent: true,
      time: new Date('2024-07-03T12:34:56.789Z'),
      favoritedBy: ['user456', 'user789'],
      commentIDs: ['comment123', 'comment456']
    })
    const savedIssue = await issue.save()

    await request(app)
      .get(`/api/issue/${savedIssue._id}`)
      .expect(200)
  })

  test('update username of an issue', async () => {
    const issue = new IssueModel({
      userID: 'testUser123',
      username: 'testUser',
      issueURL: 'https://github.com/testUser/testRepo/issues/123',
      title: 'Dummy Issue for Testing',
      description: 'This is a dummy issue created for testing purposes.',
      language: 'JavaScript',
      customLanguage: '',
      difficulty: 'Medium',
      isUrgent: true,
      time: new Date('2024-07-03T12:34:56.789Z'),
      favoritedBy: ['user456', 'user789'],
      commentIDs: ['comment123', 'comment456']
    })
    const savedIssue = await issue.save()
    const updatedUsername = 'updatedUser'

    const response = await request(app)
      .put(`/api/updateIssueUsername/${savedIssue._id}`)
      .send({ username: updatedUsername })
      .expect(200)

    expect(response.body.username).toBe(updatedUsername)
  })

  test('update favoritedBy field of an issue', async () => {
    const issue = new IssueModel({
      userID: 'testUser123',
      username: 'testUser',
      issueURL: 'https://github.com/testUser/testRepo/issues/123',
      title: 'Dummy Issue for Testing',
      description: 'This is a dummy issue created for testing purposes.',
      language: 'JavaScript',
      customLanguage: '',
      difficulty: 'Medium',
      isUrgent: true,
      time: new Date('2024-07-03T12:34:56.789Z'),
      favoritedBy: ['user456', 'user789'],
      commentIDs: ['comment123', 'comment456']
    })
    const savedIssue = await issue.save()
    const userID = 'favUser123'

    const response = await request(app)
      .put(`/api/issues/${savedIssue._id}/favorite`)
      .send({ userID })
      .expect(200)

    expect(response.body.favoritedBy).toContain(userID)
  })

  test('add a comment ID to an issue', async () => {
    const commentID = 'comment123'

    const response = await request(app)
      .put(`/api/issues/commentadd/${issueID}`)
      .send({ commentID })
      .expect(200)

    expect(response.body.commentIDs).toContain(commentID)
  })

  test('remove a comment ID from an issue', async () => {
    const issue = new IssueModel({
      userID: 'testUser123',
      username: 'testUser',
      issueURL: 'https://github.com/testUser/testRepo/issues/123',
      title: 'Dummy Issue for Testing',
      description: 'This is a dummy issue created for testing purposes.',
      language: 'JavaScript',
      customLanguage: '',
      difficulty: 'Medium',
      isUrgent: true,
      time: new Date('2024-07-03T12:34:56.789Z'),
      favoritedBy: ['user456', 'user789'],
      commentIDs: ['comment123', 'comment456']
    })
    const savedIssue = await issue.save()

    const response = await request(app)
      .put(`/api/issues/commentremove/${savedIssue._id}`)
      .send({ commentID: savedIssue.commentIDs[0] })
      .expect(200)

    expect(response.body.commentIDs).not.toContain(savedIssue.commentIDs[0])
  })

  test('delete an issue', async () => {
    const response = await request(app)
      .delete(`/api/issue/delete/${issueID}`)
      .expect(200)

    expect(response.body.message).toBe('Issue deleted successfully')
  })

  test('get issues count by time', async () => {
    await request(app)
      .get('/api/issues/countByTime')
      .expect(200)
  })

  test('get issues count by language', async () => {
    await request(app)
      .get('/api/issues/countByLanguage')
      .expect(200)
  })

  test('get issues count by difficulty', async () => {
    await request(app)
      .get('/api/issues/countByDifficulty')
      .expect(200)
  })

  test('get issues based on filter', async () => {
    const issue = new IssueModel({
      userID: 'testUser123',
      username: 'testUser',
      issueURL: 'https://github.com/testUser/testRepo/issues/123',
      title: 'Dummy Issue for Testing',
      description: 'This is a dummy issue created for testing purposes.',
      language: 'JavaScript',
      customLanguage: '',
      difficulty: 'Medium',
      isUrgent: true,
      time: new Date('2024-07-03T12:34:56.789Z'),
      favoritedBy: ['user456', 'user789'],
      commentIDs: ['comment123', 'comment456']
    })
    const savedIssue = await issue.save()

    const response = await request(app)
      .get('/api/issues/filter')
      .query({ language: 'JavaScript', difficulty: 'Medium' })
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0)
  })

  test('get issue favorited by users', async () => {
    const issue = new IssueModel({
      userID: 'testUser123',
      username: 'testUser',
      issueURL: 'https://github.com/testUser/testRepo/issues/123',
      title: 'Dummy Issue for Testing',
      description: 'This is a dummy issue created for testing purposes.',
      language: 'JavaScript',
      customLanguage: '',
      difficulty: 'Medium',
      isUrgent: true,
      time: new Date('2024-07-03T12:34:56.789Z'),
      favoritedBy: ['user456', 'user789'],
      commentIDs: ['comment123', 'comment456']
    })
    const savedIssue = await issue.save()

    const response = await request(app)
      .get(`/api/issuefavedby/${savedIssue._id}`)
      .expect(200)

    expect(response.body.favoritedBy).toBeDefined()
  })
})