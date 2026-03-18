const request = require('supertest')
const app = require('../app.js')

describe('GET /message', () => {
  it('returns 200 with stored information', async () => {
      const body = {
          name: "John Davis",
          email: "jdavis@icc.com",
          message: "Great job with the assessment Nestor!"
      }

      const message = await request(app)
                        .post('/message')
                        .send(body)
                        .set('Accept', 'application/json')

      await request(app)
          .get(`/message/${message.body.token}`)
          .expect(200)
          .then(res => {
            expect(res.body).toEqual(
              expect.objectContaining({
                success: true,
                message: body.message,
                name: body.name,
                email: body.email,
                error: null
              })
            )
          })
  });

  it('returns 400 with error message for a token that has already been retrieved', async () => {
    const body = {
          name: "John Davis",
          email: "jdavis@icc.com",
          message: "Great job with the assessment Nestor!"
    }

    const message = await request(app)
                      .post('/message')
                      .send(body)
                      .set('Accept', 'application/json')

    await request(app)
      .get(`/message/${message.body.token}`)

    await request(app)
      .get(`/message/${message.body.token}`)
      .expect(400)
      .then(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
          success: false,
          message: null,
          name: null,
          email: null,
          error: "Invalid or expired token"
        }))
      })
  })

  it('returns 400 with error message for a random token', async () => {
    const message = await request(app)
                      .get('/message/test')
                      .expect(400)
                      .then(res => {
                        expect(res.body).toEqual(
                          expect.objectContaining({
                            success: false,
                            message: null,
                            name: null,
                            email: null,
                            error: "Invalid or expired token"
                          })
                        )
                      })
  })
});

describe('POST /message', () => {
    it('returns 200 with correct message', async () => {
        const body = {
          name: "John Davis",
          email: "jdavis@icc.com",
          message: "Great job with the assessment Nestor!"
        }

        await request(app)
                    .post('/message')
                    .send(body)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(res => {
                      expect(res.body).toEqual(
                        expect.objectContaining({
                          success: true,
                          error: null,
                          token: expect.any(String)
                        })
                      )
                    })
    })

    it('returns proper error message for no name field', async () => {
      const body = {
        name: "",
        email: "jdavis@icc.com",
        message: "This should error"
      }

      await request(app)
                  .post('/message')
                  .send(body)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .then(res => {
                    expect(res.body).toEqual(
                      expect.objectContaining({
                        success: false,
                        error: "Please include a valid name value.",
                        token: null
                      })
                    )
                  })

      })
    
    it('returns proper error message for no email field', async () => {
      const body = {
        name: "John",
        email: "",
        message: "This should error"
      }

      await request(app)
                  .post('/message')
                  .send(body)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .then(res => {
                    expect(res.body).toEqual(
                      expect.objectContaining({
                        success: false,
                        error: "Please include a valid email value.",
                        token: null
                      })
                    )
                  })

      })

    it('returns proper error message for invalid message fields', async () => {
      const bodyWithNoMessage = {
        name: "John",
        email: "jdavis@icc.com",
        message: ""
      }

      const bodyWithTooLongMessage = {
        name: "John",
        email: "jdavis@icc.com",
        message: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium q"
      }

      await request(app)
                  .post('/message')
                  .send(bodyWithNoMessage)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .then(res => {
                    expect(res.body).toEqual(
                      expect.objectContaining({
                        success: false,
                        error: "Please include a valid message value.",
                        token: null
                      })
                    )
                  })

      await request(app)
                  .post('/message')
                  .send(bodyWithTooLongMessage)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(400)
                  .then(res => {
                    expect(res.body).toEqual(
                      expect.objectContaining({
                        success: false,
                        error: "Message length must be 250 characters or less.",
                        token: null
                      })
                    )
                  })
      })

    it('returns proper error message when one ore more fields are invalid', async () => {
      const body = {
        name: "",
        email: "",
        message: ""
      };

      await request(app)
              .post('/message')
              .send(body)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(400)
              .then(res => {
                expect(res.body).toEqual(
                  expect.objectContaining({
                    success: false,
                    error: "Please include a valid name value. Please include a valid email value. Please include a valid message value.",
                    token: null
                  })
                )
              })
      })
})