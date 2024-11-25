const { execSync } = require("child_process");
execSync("npm install");
const { describe, it, expect } = require("@jest/globals"); 
const { sequelize } = require("./db");
const request = require("supertest");
const app = require("./app");
const { seedSauces, seedItems } = require("./seedData");
const { Item } = require("./models");

describe("Items", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
        execSync("npm run seed");
    });

    it("GET /api/items should return a status code of 200", async () => {
        const response = await request(app).get("/api/items");
        expect(response.statusCode).toBe(200);
    });

    it("GET /api/items should return an array", async () => {
        const response = await request(app).get("/api/items");
        expect(response.body).toBeInstanceOf(Array);
    })

    it("GET /api/items should return correct number of restaurants", async () => {
        const response = await request(app).get("/api/items");
        expect(response.body).toHaveLength(20);
    });
    
    it("GET /api/items should return the correct data", async () => {
        const response = await request(app).get("/api/items");
        expect(response.body[0]).toEqual(expect.objectContaining({
            "name":"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            "price":109.95,
            "description":"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            "category":"men's clothing",
            "image":"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
         }));
    })

    it("GET /api/items/:id should return a correct data for single item",  async() => {
        const response = await request(app).get("/api/items/3");
        expect(response.body).toEqual(expect.objectContaining({
            "name":"Mens Cotton Jacket",
            "price":55.99,
            "description":"great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
            "category":"men's clothing",
            "image":"https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
        }))
    })
})