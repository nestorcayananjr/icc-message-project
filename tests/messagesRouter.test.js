const request = require('supertest')
const app = require('../app.js')

describe('GET /message', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/message/key');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("RetrievedMessage for key of: key");
  });
});

describe('POST /message', () => {
    it('returns 200 with correct message', async () => {
        const res = await request(app).post('/message');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe("Message stored")
    })
})