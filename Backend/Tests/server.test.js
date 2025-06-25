const request = require('supertest')
const app = require('../app')

jest.mock('fs')
const { readFile, readFileSync, writeFile } = require('fs')

describe('GET /API/posts', () => {
  it('should return posts from your file', async () => {
    readFile.mockImplementation((path, encoding, callback) => {
      callback(null, JSON.stringify([{ id: 0, title: 'Title', author: 'Author', content: 'content'}])) // No error send json string
    })

    const res = await request(app).get('/API/posts')
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 0, title: 'Title', author: 'Author', content: 'content'}])
  });

  it('should return 500 if reading file fails', async () => {
    readFile.mockImplementation((path, encoding, callback) => {
      callback(new Error('fail'), null);
    })
    
    const res = await request(app).get('/API/posts')
    expect(res.statusCode).toBe(500)
  })
})

describe('POST /API/posts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new post successfully', async () => {
    // Mock readFile to return existing posts array
    readFile.mockImplementation((path, encoding, callback) => {
      callback(null, JSON.stringify([]));
    });

    // Mock readFileSync to return last ID as '0'
    readFileSync.mockReturnValue('0');

    // Mock writeFile to simulate successful write
    writeFile.mockImplementation((path, data, callback) => {
      callback(null);
    });

    const newPost = { title: 'Test Title', author: 'Tester', content: 'Test content' };

    const res = await request(app)
      .post('/API/posts')
      .send(newPost)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Sucesfully Wrote to file' });

    expect(readFile).toHaveBeenCalled();
    expect(readFileSync).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalledTimes(2); // writing posts and writing id
  });

  it('should return 400 if missing required fields', async () => {
    const incompletePost = { title: 'Title', author: 'Author' }; // missing content

    const res = await request(app)
      .post('/API/posts')
      .send(incompletePost)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Missing fields' });
  });

  it('should return 500 if reading posts file fails', async () => {
    readFile.mockImplementation((path, encoding, callback) => {
      callback(new Error('read error'), null);
    });

    const newPost = { title: 'Title', author: 'Author', content: 'Content' };

    const res = await request(app)
      .post('/API/posts')
      .send(newPost)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'Server Error' });
  });

  it('should return 500 if writing posts file fails', async () => {
    readFile.mockImplementation((path, encoding, callback) => {
      callback(null, JSON.stringify([]));
    });

    readFileSync.mockReturnValue('0');

    writeFile.mockImplementationOnce((path, data, callback) => {
      callback(new Error('write error'));
    });

    const newPost = { title: 'Title', author: 'Author', content: 'Content' };

    const res = await request(app)
      .post('/API/posts')
      .send(newPost)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'Failed to update file'});
  });

  it('should return 500 if writing ID file fails', async () => {
    readFile.mockImplementation((path, encoding, callback) => {
      callback(null, JSON.stringify([]));
    });

    readFileSync.mockReturnValue('0');

    writeFile
      .mockImplementationOnce((path, data, callback) => {
        callback(null); // first writeFile succeeds (posts)
      })
      .mockImplementationOnce((path, data, callback) => {
        callback(new Error('write id error')); // second writeFile fails (id)
      });

    const newPost = { title: 'Title', author: 'Author', content: 'Content' };

    const res = await request(app)
      .post('/API/posts')
      .send(newPost)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'Failed to update id'});
  });
});
