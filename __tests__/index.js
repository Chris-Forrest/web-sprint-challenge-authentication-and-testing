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
    it("FAILS POST .register", async ()=>{
        const res = await supertest(server)
                .post("/api/auth/register")
                .send({ username: "kash", password:"whatup"})
            expect(res.statusCode).toBe(409)
            expect(res.body.message).toBe("username already exists")
    })

    it("POST /api/auth/login", async () => {
        const res = await supertest(server)
                .post("/api/auth/login")
                .send({username:"kash", password:"whatup"})
            expect(res.statusCode).toBe(200)
            expect(res.type).toBe("application/json")
            expect(res.body.message).toBe("Welcome kash")
    })
    it("FAILS POST /login", async ()=> {
        const res = await supertest(server)
                .post("/api/auth/login")
                .send({username:"stevejobbed", password:"allgone"})
            expect(res.statusCode).toBe(401)
            expect(res.body.message).toBe("Invalid username")
    })
    it("GETS a list of users api/auth/users",async () => {
        const login = await supertest(server)
                .post("/api/auth/login")
                .send({username:"kash",password:"whatup"})
        const { token } = await login.body;
       // console.log(login.body)
        const res = await supertest(server)
                .get("/api/auth/users")
                .set("authorization", token)
            
    })
});
