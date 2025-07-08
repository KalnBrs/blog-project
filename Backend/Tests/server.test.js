// Mock DB module
jest.mock('../db', () => ({
  query: jest.fn()
}));

const pool = require('../db');
const { getPosts, createPost, findId } = require('../Controllers/postsControllers');

const httpMocks = require('node-mocks-http');

describe('getPosts', () => {
  it('should return all posts', async () => {
    const mockPosts = [{ title: 'Post 1' }, { title: 'Post 2' }];
    pool.query.mockResolvedValueOnce({ rows: mockPosts });

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await getPosts(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockPosts);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM posts');
  });

  it('should return 500 on DB error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'));

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await getPosts(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Server Error' });
  });
});

describe('createPost', () => {
  it('should create and return a post', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        title: 'New Post',
        author: 'Kaelan',
        content: 'Cool content'
      }
    });
    const res = httpMocks.createResponse();

    const mockReturn = {
      rows: [{
        post_uid: 'uuid-123',
        title: 'New Post',
        author: 'Kaelan',
        content: 'Cool content'
      }]
    };

    pool.query.mockResolvedValueOnce(mockReturn);

    await createPost(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(mockReturn.rows[0]);
    expect(pool.query).toHaveBeenCalledWith(
      ' INSERT INTO posts (post_uid, title, author, content) VALUES (uuid_generate_v4(), $1, $2, $3) RETURNING *',
      ['New Post', 'Kaelan', 'Cool content']
    );
  });

  it('should return 400 if fields are missing', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        title: 'Missing Content'
      }
    });
    const res = httpMocks.createResponse();

    await createPost(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Missing fields' });
  });

  it('should return 500 on DB error', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        title: 'Error Post',
        author: 'Kaelan',
        content: 'Problem'
      }
    });
    const res = httpMocks.createResponse();

    pool.query.mockRejectedValueOnce(new Error('DB error'));

    await createPost(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Server Error' });
  });
});

describe('findId', () => {
  it('should respond with found post', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    pool.query.mockResolvedValueOnce({
      rows: [{ post_uid: 'uuid', title: 'Hello' }]
    });

    await findId(req, res, next, 'uuid');

    expect(res.statusCode).toBe(202);
    expect(res._getJSONData()).toEqual({ post_uid: 'uuid', title: 'Hello' });
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM posts WHERE post_uid = $1',
      ['uuid']
    );
    expect(next).toHaveBeenCalled();
  });

  it('should return 500 on DB error', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    pool.query.mockRejectedValueOnce(new Error('fail'));

    await findId(req, res, next, 'uuid');

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Server Error' });
    expect(next).not.toHaveBeenCalled(); // stops on error
  });
});
