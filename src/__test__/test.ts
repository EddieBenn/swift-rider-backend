import supertest from "supertest";
import { db } from "../config/index";
import app from "../app";

const request = supertest(app);
let token: string[];
//Test to get all orders for users

beforeAll(async() => {
  await db.sync().then(() => {
      console.log('DB connected successfully')
  })
});

describe("Testing rider accept order", () => {

  beforeEach(async () => {
    await db.sync().then(() => console.log("DB connected successfully")).catch(err=>{
      console.log("DB connected successfully")
    });
  })
  

  it('When rider acceps order', async () => {
    await request
    .get("/riders/rider-order-profile/4d6ae072-45e7-4ada-9332-976d56c8ac69")
      .expect(400)
      .set('Accept', 'application/json')
      .then((response: any) => {
        expect(response.body).toEqual(expect.arrayContaining([]))
      })
  })
});

//Test to get all orders for users
describe("Testing pickup user history", () => {
  beforeEach(async () => {
    await db.sync().then(() => console.log("Database is connected")).catch(err=>{
      console.log("Database is not connected")
    });
  })
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImExNzA0MzY0LTBjZjQtNGE3YS1iZjVhLTYxNTUxZGRhYjg0NyIsImVtYWlsIjoiaWxvY2hpYnVpa2VAeWFob28uY29tIiwidmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE2NzM1OTYzNjMsImV4cCI6MTY3MzY4Mjc2M30.T8mDY-hAFt2VSSPdM0JPwBzh7K2Q-IHZvHl9a7E5qic"
  const wrongToken = "";
  it('When wrong token is passed', async () => {
    await request
    .get("/users/my-orders")
      .expect(401)
      .set({ authorization: `Bearer ${wrongToken}` })
      .then((response: any) => {
        expect(response.status).toBe(401)
      })
  })
  it('When right token is passed', async () => {
    await request
    .get("/users/my-orders")
      .expect(200)
      .set({ authorization: `Bearer ${token}` })
      .then((response: any) => {
        expect(response.body).toHaveProperty("message")
      })
  })
});


describe('Post/Get/Update/Delete', () => {
  describe('get route', () => {
      it('get rider-history should return 200', async ()=>{
        await supertest(app).get('/riders/rider-history')
          expect(200) 
      })}
      )}
)