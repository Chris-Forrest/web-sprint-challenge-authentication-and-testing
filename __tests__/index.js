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
                .send({ usernmae:"kash", password: "whatup"})
            expect(res.statusCode).toBe(201)
            expect(res.type).toBe("application/json")
            expect(res.body.username).toBe("kash") 
    })
})
