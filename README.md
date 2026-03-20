<h1 align="center">ICC-Message-Project</h3>

<!-- GETTING STARTED -->

## Prerequisites

Make sure you have the following installed locally. Links to each one are provided below.

- Node.js: https://nodejs.org/en
- MongoDB: https://www.mongodb.com/

## Getting Started

1. Clone the repo

   ```sh
   git clone https://github.com/nestorcayananjr/icc-message-project.git
   cd icc-message-project
   ```

2. Run MongoDB locally

   ```sh
   brew services start mongodb-community
   ```

3. Set up environment variables

   ```sh
   create the .env file --> touch .env

   add the following variables:
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/nestor-test
   ```

4. Start the server

   ```sh
   npm install
   npm run dev
   ```

5. Server should now be started on localhost:3000

6. To run tests run following command in terminal

   ```sh
   npm run test
   ```

   or run following command to automatically run tests during development

   ```sh
   npm run test:watch
   ```

   <br>

## How to test

1. Run server locally
   ```sh
   npm run dev
   ```

2. Open Postman and send a post request to http://localhost:3000/message. Click the body tab, choose the raw option and copy and paste the following...
   ```sh
   {
    "name": "John Davis",
    "email": "jdavis@icc.com",
    "message": "Great job with the assessment Nestor!"
   }
   ```

3. Verify you receive a status 200 along with the following data...
```sh
{
  success: true,
  error: null,
  token: "TOKEN"
}
```
  Copy the token value, as you will need this for the next steps.

4. In a new tab in postman, send a get reqeuest to localhost:3000/message/{token}, using the token value from step 3. Verify you receive a status 200 along with the following data...

```sh
{
    success: true,
    name: "John Davis",
    email: "jdavis@icc.com",
    message: "Great job with the assessment Nestor!",
    error: null
}
```
5. Repeat step 4 with the same token, (i.e. click send again) this time you should verify you receive a status 400 along with the following data...

```sh
{
  success: false,
  message: null,
  name: null,
  email: null,
  error: "Invalid or expired token"
}
```

6. Navigate to the utils/checkIfInLast24Hours.js file. Change the EXPIRATION_TIME value to 1. Repeat steps 2 and 3 with different values. Use the token retrieved and repeat step 4, verify you receive a status 400 with the same data you received in step 5.

7. Change EXPIRATION_TIME value back to 86400000.

8. Open Postman and send a post request to localhost:3000/message. In the request include this in the body
   ```sh
   {
    "name": "",
    "email": "jdavis@icc.com",
    "message": "Great job with the assessment Nestor!"
   }
   ```

   Verify you recieve a 400 status with the following response...
   ```sh
   {    
   success: false,
    error: "Please include a valid name value.",
    token: null
    }
   ```

9. Repeat step 8 with the following data, verifying the error message after each one...

   ```sh
   {    
   "name": "John Davis",
    "email": "jdavisicc.com",
    "message": "Great job with the assessment Nestor!"
    }

   Verify you recieve a 400 status with the following response...
   {
    success: false,
    error: "Please include a valid email value.",
    token: null
   }
   ```

   ```sh
   {
    "name": "John Davis",
    "email": "jdavis@icc.com",
    "message": ""
   }

   Verify you recieve a 400 status with the following response...
   {
    success: false,
    error: "Please include a valid message value.",
    token: null
   }
   ```

    ```sh
    {
    "name": "John Davis",
    "email": "jdavis@icc.com",
    "message": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium q"
    }

   Verify you recieve a 400 status with the following response...
   {
    success: false,
    error: "Message length must be 250 characters or less.",
    token: null
   }
   ```

10. Try passing different combinations of invalid values to the POST request (missing name or invalid type, missing email or invalid email [ex: no `@` or `.`, no characters before the `@`, etc.], missing, invalid, or too long of a message). Verify the error message reflects invalid values.

11. Run the npm run test command, verify all tests pass.


## API Endpoints

### POST `/message`

Stores a new message and returns a token that can be used to retrieve it.

**Request Body**

| Field     | Type   | Required | Constraints           |
| --------- | ------ | -------- | --------------------- |
| `name`    | String | Yes      |                       |
| `email`   | String | Yes      | Must be a valid email |
| `message` | String | Yes      | Max 250 characters    |

**Example Request**

```json
{
  "name": "John Davis",
  "email": "jdavis@icc.com",
  "message": "Hello!"
}
```

**Responses**

| Status | Description                          |
| ------ | ------------------------------------ |
| `200`  | Message stored successfully          |
| `400`  | One or more fields failed validation |

**Example Success Response `200`**

```json
{
  "success": true,
  "token": "64f1c2e8b1a2c3d4e5f6a7b8",
  "error": null
}
```

**Example Error Response `400`**

```json
{
  "success": false,
  "token": null,
  "error": "Please include a valid name value. Please include a valid email value."
}
```

---

### GET `/message/:token`

Retrieves a stored message by its token. A message can only be retrieved once and within 24 hours of creation.

**URL Parameters**

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| `token`   | String | The token returned from `POST /message` |

**Responses**

| Status | Description                                                 |
| ------ | ----------------------------------------------------------- |
| `200`  | Message retrieved successfully                              |
| `400`  | Token is invalid, already retrieved, or older than 24 hours |
| `500`  | Internal server error                                       |

**Example Success Response `200`**

```json
{
  "success": true,
  "name": "John Davis",
  "email": "jdavis@icc.com",
  "message": "Hello!",
  "error": null
}
```

**Example Error Response `400`**

```json
{
  "success": false,
  "name": null,
  "email": null,
  "message": null,
  "error": "Invalid or expired token"
}
```

<!-- Engineering Decisions -->

## Engineering Decisions

### Message Schema

| Field     | Type     | Constraints   | Notes                                            |
| --------- | -------- | ------------- | ------------------------------------------------ |
| \_id      | ObjectId | Primary Key   | Auto-generated by MongoDB                        |
| name      | String   | Required      |                                                  |
| email     | String   | Required      |                                                  |
| message   | String   | Required      |                                                  |
| valid     | Boolean  | Default: true | Set to false once the message has been retrieved |
| createdAt | Date     |               | Auto-generated by Mongoose timestamps            |
| updatedAt | Date     |               | Auto-updated by Mongoose on every save           |

**Explanation:**
Our API has two primary functions - storing messages and retrieving messages. Messages should only be able to be
retrieved under two conditions (1) a key that matches the \_id field is provided to the api and (2) the message has not been retrieved before and it has not been more than 24 hours since the message was stored.

In order to achieve this we are using the generated \_id when storing the message into the database as well as the auto-updated updatedAt field in order to check if it has been more than 24 hours since a message was stored. The decision was made to utilize the updatedAt field in the case functionality expands to being able to edit a message. Additionally, there is a valid field that defaults to true and is set to false once the message has been retrieved OR it has been more than 24 hours since the message has been stored.

There was consideration to utilize another field to store a key that is different from the \_id, however to keep the minimize the amount of fields on the schema.

---

### Error Handling

When calling the GET endpoint, a 400 error is returned with a generic "Invalid or expired token" error message, therefore not distinguishing the cause of the error (that is, whether it's expired or has been retrieved already). This allows us to not leak information about why access was denied.

## Further Development

- UI to store and retrieve messages
- Security Enhancements (ex: improved sterilization)
- Extension of API: editing a message, deleting a message from the db.
- Functionality to retrieve a message more than once.
