const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { CommentModel, IssueModel, UserModel } = require('../models'); 
const dotenv = require('dotenv')
dotenv.config()

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI);
  console.log('connected db for testing')
});

afterAll(async () => {
  mongoose.connection.close();
  console.log('closed db for testing')
});

afterEach(async () => {
  // Clean up the database after each test
  await CommentModel.deleteMany({});
  await IssueModel.deleteMany({});
  await UserModel.deleteMany({});
});

describe('Comment API', () => {
  let issueID;
  let userID;

  beforeEach(async () => {
    // Create a dummy issue and user for testing
    const issue = {
      _id: 'testIssue123',
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
    }
    issueID = issue._id;

    const user = {
      _id: 'user',
      userID: "testUser123",
      username: "testUser",
      email: "testUser@example.com",
      issuesPosted: ["issueId1", "issueId2"],
      issuesFavorited: ["issueId3", "issueId4"],
      commentsAdded: ["commentId1", "commentId2"],
      profileImageUrl: "https://gitfries.s3.eu-west-2.amazonaws.com/profile-images/me.png"
    }
    userID = user.userID;
  });

  beforeAll(async () => {
    await CommentModel.deleteMany({});
  });

  afterAll(async () => {
    await CommentModel.deleteMany({});
    mongoose.connection.close();
  });
  

  test('create a new comment', async () => {
    const newComment = {
      userID: "testUser123",
      username: "testUser",
      issueID: "testIssue123",
      content: "This is a test comment",
      time: "2024-07-03T12:34:56.789Z",
      parentCommentID: null,
      nestedComments: []
    }

    const response = await request(app)
      .post('/api/commentcreate')
      .send(newComment)
      .expect(200);

    expect(response.body.content).toBe('This is a test comment');
    expect(response.body.issueID).toBe(String(issueID));
    expect(response.body.userID).toBe(userID);
  });

  test('update the username of a comment', async () => {
    const comment = new CommentModel({
      userID: "testUser123",
      username: "testUser",
      issueID: "testIssue123",
      content: "This is a test comment",
      time: "2024-07-03T12:34:56.789Z",
      parentCommentID: null,
      nestedComments: []
    });
    const savedComment = await comment.save();

    const updatedUsername = 'updatedUser';

    const response = await request(app)
      .put(`/api/updateCommentUsername/${savedComment._id}`)
      .send({ username: updatedUsername })
      .expect(200);

    expect(response.body.username).toBe(updatedUsername);
  });

  test('get comments by issueID', async () => {
    const comment = new CommentModel({
      userID: "testUser123",
      username: "testUser",
      issueID: "testIssue123",
      content: "This is a test comment",
      time: "2024-07-03T12:34:56.789Z",
      parentCommentID: null,
      nestedComments: []
    });
    const savedComment = await comment.save();

    const response = await request(app)
      .get(`/api/comments/${savedComment.issueID}`)
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe('This is a test comment');
  });

  test('get a comment by commentID', async () => {
    const comment = new CommentModel({
      userID: "testUser123",
      username: "testUser",
      issueID: "testIssue123",
      content: "This is a test comment",
      time: "2024-07-03T12:34:56.789Z",
      parentCommentID: null,
      nestedComments: []
    });
    const savedComment = await comment.save();

    const response = await request(app)
      .get(`/api/singleComment/${savedComment._id}`)
      .expect(200);

    expect(response.body.content).toBe('This is a test comment');
  });

  test('delete a comment by commentID', async () => {
    const comment = new CommentModel({
      userID: "testUser123",
      username: "testUser",
      issueID: "testIssue123",
      content: "This is a test comment",
      time: "2024-07-03T12:34:56.789Z",
      parentCommentID: null,
      nestedComments: []
    });
    const savedComment = await comment.save();

    await request(app)
      .delete(`/api/comment/delete/${savedComment._id}`)
      .expect(200);

    const deletedComment = await CommentModel.findById(savedComment._id);
    expect(deletedComment).toBeNull();
  });

  test('delete all comments by issueID', async () => {
    const comment = new CommentModel({
      userID: "testUser123",
      username: "testUser",
      issueID: "testIssue123",
      content: "This is a test comment",
      time: "2024-07-03T12:34:56.789Z",
      parentCommentID: null,
      nestedComments: []
    });
    const savedComment = await comment.save();

    await request(app)
      .delete(`/api/comments/delete/${savedComment.issueID}`)
      .expect(200);

    const comments = await CommentModel.find({ issueID: savedComment.issueID });
    expect(comments.length).toBe(0);
  });

  test('delete a comment and its nested comments', async () => {
    const parentComment = new CommentModel({
      userID: "testUser123",
      username: "testUser",
      issueID: "testIssue123",
      content: "This is a test comment",
      time: "2024-07-03T12:34:56.789Z",
      parentCommentID: null,
      nestedComments: []
    });
    const savedParentComment = await parentComment.save();
    
    const nestedComment = new CommentModel({
      userID: "testUser123",
      username: "testUser",
      issueID: "testIssue123",
      content: "This is a test comment",
      time: "2024-07-03T12:34:56.789Z",
      parentCommentID: savedParentComment._id,
      nestedComments: []
    });
    const savedNestedComment = await nestedComment.save();

    savedParentComment.nestedComments.push(savedNestedComment._id);
    await savedParentComment.save();

    await request(app)
      .delete(`/api/comment/deletenested/${savedParentComment._id}`)
      .send({ issueID: savedParentComment.issueID, userID: savedParentComment.userID })
      .expect(200);
  });
});
