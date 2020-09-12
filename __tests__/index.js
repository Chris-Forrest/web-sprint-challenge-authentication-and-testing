const supertest = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
});

afterAll(async () => {
    await db.destroy()
});

describe("user auth testing", () => {
    it("POST /api/auth/register", async() => {
        const res = await supertest(server)
                .post("/api/auth/register")
                .send({ username:"kash", password: "whatup"})
            expect(res.statusCode).toBe(201)
            expect(res.type).toBe("application/json")
            expect(res.body.username).toBe("kash") 
    })

    it("POST /api/auth/login", async () => {
        const res = await (await supertest(server).post("/api/auth/login")).setEncoding({username:"kash", password:"whatup"})
    })
})
