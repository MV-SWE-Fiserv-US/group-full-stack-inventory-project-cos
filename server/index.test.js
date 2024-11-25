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

  test("GET /items should return a status code of 200", async () => {
    const response = await request(app).get("/items");
    expect(response.statusCode).toBe(200);
  });

  test("GET /items should return an array", async () => {
    const response = await request(app).get("/items");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("GET /items should return correct number of restaurants", async () => {
    const response = await request(app).get("/items");
    expect(response.body).toHaveLength(20);
  });

  test("GET /items should return the correct data", async () => {
    const response = await request(app).get("/items");
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
          "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      })
    );
  });

  test("GET /items/:id should return a correct data for single item", async () => {
    const response = await request(app).get("/items/3");
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "Mens Cotton Jacket",
        price: 55.99,
        description:
          "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      })
    );
  });

  test("POST /items/:id should return a correct data for single item", async () => {
    const body = {
      name: "Sample Item",
      description: "This is a sample item description.",
      category: "Sample Category",
      price: 19.99,
      image: "http://example.com/sample-image.jpg",
    };
    const response = await request(app).post("/items/").send(body);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(body);
  });

  test("PUT /items/:id should return a correct data for single item", async () => {
    const body = {
      name: "Sample Item",
      description: "This is a sample item description.",
      category: "Sample Category",
      price: 19.99,
      image: "http://example.com/sample-image.jpg",
    };
    await request(app).put("/items/20").send(body);
    const response = await request(app).get("/items/20");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(body);
  });

  test("DELETE /items/:id should delete an item", async () => {
    const body = {
      name: "Sample Item",
      description: "This is a sample item description.",
      category: "Sample Category",
      price: 19.99,
      image: "http://example.com/sample-image.jpg",
    };
    const newItem = await request(app).post("/items/").send(body);
    await request(app).get("/items/21");
    const response = await request(app).get("/items/21");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(body);

    const deletedItem = await request(app).delete("/items/21").send(body);
    const deletedResponse = await request(app).get("/items/21");
    expect(deletedResponse.status).toBe(404);
  });
});

describe("Users", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    execSync("npm run seed");
  });

  test("GET /users should return a status code of 200", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
  });

  test("GET /users should return an array", async () => {
    const response = await request(app).get("/users");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("GET /users should return correct number of users", async () => {
    const response = await request(app).get("/users");
    expect(response.body).toHaveLength(3);
  });

  test("GET /users/:id should return a correct data for single user", async () => {
    const response = await request(app).get("/users/1");
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashedpassword123",
        cart: [],
        isAdmin: false,
      })
    );
  });

  //   router.get("/:id/orders", async (req, res, next) => {
  //   try {
  //     const user = await User.findByPk(req.params.id, {
  //       include: [Order],
  //     });
  //     res.json(user);
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  test("GET /users/:id/orders should return a correct data for single user", async () => {
    const response = await request(app).get("/users/1/orders");
    expect(response.body.orders).toHaveLength(2);
  });

  test("POST /users should return a correct data for single user", async () => {
    const body = {
      name: "Michael Scott",
      email: "m.scott@example.com",
      password: "dundermifflin",
      cart: [],
      isAdmin: true,
    };
    const response = await request(app).post("/users/").send(body);
    expect(response.body).toMatchObject(body);
  });

  test("PUT /items/:id should return a correct data for single item", async () => {
    const body = {
      name: "Michael Scott",
      email: "micheal.scott@example.com",
      password: "dundermifflin",
      cart: [],
      isAdmin: true,
    };
    await request(app).put("/users/3").send(body);
    const response = await request(app).get("/users/3");
    expect(response.body).toMatchObject(body);
  });

  test("DELETE /users/:id should delete an user", async () => {
    await request(app).delete("/users/1");
    const response = await request(app).get("/users/");
    expect(response.body).toHaveLength(2);
  });
});
