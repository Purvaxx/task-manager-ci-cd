const request = require('supertest');
const app = require('../src/app');
const store = require('../src/models/taskStore');

beforeEach(() => {
  store.reset();
});

describe('GET /health', () => {
  it('returns 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Tasks API', () => {
  it('returns an empty list initially', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('creates a task', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Write README' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: 'Write README', done: false });
  });

  it('rejects creating a task without a title', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('fetches a single task by id', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Ship pipeline' });
    const res = await request(app).get(`/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Ship pipeline');
  });

  it('returns 404 for a task that does not exist', async () => {
    const res = await request(app).get('/tasks/999');
    expect(res.status).toBe(404);
  });

  it('updates a task', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Draft' });
    const res = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it('deletes a task', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Temp' });
    const del = await request(app).delete(`/tasks/${created.body.id}`);
    expect(del.status).toBe(204);

    const getAfter = await request(app).get(`/tasks/${created.body.id}`);
    expect(getAfter.status).toBe(404);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
  });
});
