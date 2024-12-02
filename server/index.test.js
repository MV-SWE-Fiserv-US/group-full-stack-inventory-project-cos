const { execSync } = require("child_process");
execSync("npm install");
const { sequelize } = require("./db");
const request = require("supertest");
const app = require("./app");
const { Order, User, Item } = require("./models");

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
    expect(response.body).toHaveLength(20);
  });

  test("GET /items should return correct data for all items", async () => {
    const response = await request(app).get("/items");
    const items = JSON.parse(JSON.stringify(await Item.findAll()));
    expect(response.body).toEqual(expect.objectContaining(items));
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

  test("GET items/:id to throw a 404 error for unfound items", async () => {
    const response = await request(app).get("/items/201");
    expect(response.status).toBe(404);
  });

  test("POST /items should return a correct data for single item", async () => {
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

  test("POST /items should return an error for invalid data", async () => {
    const body = {
      name: "Sample Item",
    };
    const response = await request(app).post("/items/").send(body);
    expect(response.body).toHaveProperty("errors");
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

  test("PUT /items/:id to throw an error for invalid data", async () => {
    const body = {
      name: "Sample Item",
    };
    const response = await request(app).put("/items/20").send(body);
    expect(response.body).toHaveProperty("errors");
  });

  test("DELETE /items/:id should delete an item", async () => {
    const body = {
      name: "Sample Item",
      description: "This is a sample item description.",
      category: "Sample Category",
      price: 19.99,
      image: "http://example.com/sample-image.jpg",
    };
    await request(app).post("/items/").send(body);
    await request(app).get("/items/21");
    const response = await request(app).get("/items/21");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(body);
  });

  test("DELETE items/:id to throw a 404 error for unfound items", async () => {
    const response = await request(app).delete("/items/201");
    expect(response.status).toBe(404);
  });

  test("DELETE /items/:id should return a confirmation string", async () => {
    const response = await request(app).delete("/items/1");
    expect(response.text).toBe("Item deleted");
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
    expect(response.body).toHaveLength(3);
  });

  test("GET /users should return correct data for all users", async () => {
    const response = await request(app).get("/users");
    const users = JSON.parse(JSON.stringify(await User.findAll()));
    expect(response.body).toEqual(expect.objectContaining(users));
  });

  test("GET /users/:id should return a correct data for single user", async () => {
    const response = await request(app).get("/users/1");
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "john.doe@example.com",
        cart: [],
        isAdmin: false,
      })
    );
  });

  test("GET /users/:id/orders should return a correct data for single user", async () => {
    const response = await request(app).get("/users/1/orders");
    expect(response.body.orders).toHaveLength(2);
  });

  test("POST /users should return a correct data for single user", async () => {
    const body = {
      name: "Michael Scott",
      email: "m.scott@example.com",
      password: "DunderMifflin12!",
      cart: [],
      isAdmin: true,
    };
    const response = await request(app).post("/users/").send(body);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("cart");
    expect(response.body).toHaveProperty("isAdmin");
  });

  test("POST /users should return an error for invalid data", async () => {
    const body = {
      name: "Michael Scott",
      email: "",
      password: "Password1@",
    };
    const response = await request(app).post("/users/").send(body);
    expect(response.body).toHaveProperty("errors");
  });

  test("PUT /items/:id should return a correct data for single item", async () => {
    const body = {
      name: "Michael Scott",
      email: "micheal.scott@example.com",
      password: "DunderMifflin12@",
      cart: [],
      isAdmin: true,
    };
    await request(app).put("/users/3").send(body);
    const response = await request(app).get("/users/3");
    expect(response.body).toMatchObject(body);
  });

  test("PUT /users/:id to throw an error for invalid data", async () => {
    const body = {
      name: "Michael Scott",
      email: "",
      password: "DunderMifflin12@",
      cart: "",
    };
    const response = await request(app).put("/users/3").send(body);
    expect(response.body).toHaveProperty("errors");
  });

  test("PUT /users/:id/addToCart/:itemId should add an item to the cart", async () => {
    await request(app).put("/users/1/addToCart/1");
    const response = await request(app).get("/users/1");
    expect(response.body.cart).toHaveLength(1);
  });

  test("PUT /users/:id/updateCart", async () => {
    const newCart = [
      {
        category: "jewelery",
        createdAt: "2024-12-02T19:10:40.595Z",
        description:
          "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
        id: 5,
        image:
          "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
        price: 695,
        updatedAt: "2024-12-02T19:10:40.595Z",
      },
      {
        category: "jewelery",
        createdAt: "2024-12-02T19:10:40.595Z",
        description:
          "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
        id: 5,
        image:
          "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
        price: 695,
        updatedAt: "2024-12-02T19:10:40.595Z",
      },
    ];
    await request(app).put("/users/1/updateCart").send(newCart);
    const response = await request(app).get("/users/1");
    expect(response.body.cart).toHaveLength(2);
  });

  test("DELETE /users/:id should delete an user", async () => {
    await request(app).delete("/users/1");
    const response = await request(app).get("/users/");
    expect(response.body).toHaveLength(2);
  });
});

describe("Orders", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    execSync("npm run seed");
  });

  test("GET /orders should return a status code of 200", async () => {
    const response = await request(app).get("/orders");
    expect(response.statusCode).toBe(200);
  });

  test("GET /orders should return an array", async () => {
    const response = await request(app).get("/orders");
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(3);
  });

  test("GET /orders should return correct data for all orders", async () => {
    const response = await request(app).get("/orders");
    const orders = JSON.parse(JSON.stringify(await Order.findAll()));
    expect(response.body).toEqual(expect.objectContaining(orders));
  });

  test("GET /orders/:id should return a correct data for single order", async () => {
    const response = await request(app).get("/orders/1");
    expect(response.body).toEqual(
      expect.objectContaining({
        userId: 1,
        total: 154.55,
        status: "Shipped",
      })
    );
  });

  test("POST /orders should return a correct data for single order", async () => {
    const body = {
      userId: 3,
      total: 54.1,
      status: "Pending",
    };
    const response = await request(app).post("/orders/").send(body);
    expect(response.body).toMatchObject(body);
  });

  test("POST /orders/:userId should return a correct data for single order", async () => {
    await request(app).put("/users/1/addToCart/1");
    const response = await request(app).post("/orders/1");
    expect(response.body.total).toBe("117.65");
  });

  test("PUT /orders/:id should return a correct data for single order", async () => {
    const body = {
      userId: 3,
      total: 504.1,
      status: "Shipped",
    };
    await request(app).put("/orders/3").send(body);
    const response = await request(app).get("/orders/3");
    expect(response.body).toMatchObject(body);
  });

  test("DELETE /orders/:id should delete an order", async () => {
    await request(app).delete("/orders/1");
    const response = await request(app).get("/orders/");
    expect(response.body).toHaveLength(2);
  });
});

describe("Auth", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    execSync("npm run seed");
  });

  test("POST /auth/register should return a 201 status code", async () => {
    const body = {
      name: "Test User",
      email: "test@test.com",
      password: "Password123!",
    };
    const response = await request(app).post("/auth/register").send(body);
    expect(response.status).toBe(201);
  });

  test("POST /auth/register should hash the password", async () => {
    const body = {
      name: "Test User",
      email: "test@test.com",
      password: "Password123!",
    };
    await request(app).post("/auth/register").send(body);
    const response = await request(app).get("/users/4");
    expect(response.body.password).not.toBe(body.password);
  });

  test("POST /auth/login should return a token", async () => {
    const body = {
      email: "john.doe@example.com",
      password: "hashedPassword123!!",
    };
    const response = await request(app).post("/auth/login").send(body);
    expect(response.body).toHaveProperty("token");
  });

  test("POST /auth/login should return a 400 status code for invalid credentials", async () => {
    const body = {
      email: "john.doe@example.com",
      password: "hashedPassword123!",
    };
    const response = await request(app).post("/auth/login").send(body);
    expect(response.status).toBe(400);
  });

  test("POST /auth/register should return an error for invalid data", async () => {
    const body = {
        name: "Test User",
    };
    const response = await request(app).post("/auth/register").send(body);
    expect(response.status).toBe(500);
  });
});

describe("Payment", () => {
  test("POST /payment-intent should return a client secret", async () => {
    const response = await request(app)
      .post("/payment-intent")
      .send({ total: 1000 });
    expect(response.body).toHaveProperty("clientSecret");
  });

  test("POST /payment-intent should return with a 500 status code for invalid request", async () => {
    const response = await request(app).post("/payment-intent").send({});
    expect(response.status).toBe(500);
  });
});

describe("404", () => {
  test("GET /404 should return a 404 status code", async () => {
    const response = await request(app).get("/404");
    expect(response.status).toBe(404);
  });
});

describe("Error handling middleware", () => {
  test("should handle an error thrown in the existing route", async () => {
    const originalHandler = app._router.stack[1].handle;

    app._router.stack[1].handle = (req, res, next) => {
      const error = new Error("Simulated error in existing route");
      next(error);
    };

    const response = await request(app).get("/users");

    expect(response.status).toBe(500);
    app._router.stack[1].handle = originalHandler;
  });
});

describe("POST /auth/login", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(User, 'findOne').mockImplementation(() => { throw error; });

      const response = await request(app)
          .post('/auth/login')
          .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("GET /items", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Item, 'findAll').mockImplementation(() => { throw error; });

      const response = await request(app).get('/items');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("GET /items/:id", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Item, 'findAll').mockImplementation(() => { throw error; });

      const response = await request(app).get('/items/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("POST /items", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Item, 'create').mockImplementation(() => { throw error; });

      const response = await request(app)
          .post('/items')
          .send({
              name: 'Test Item',
              description: 'Test Description',
              category: 'Test Category',
              price: 10.0,
              image: 'http://example.com/image.jpg'
          });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("PUT /items/:id", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Item, 'update').mockImplementation(() => { throw error; });

      const response = await request(app)
          .put('/items/1')
          .send({
              name: 'Test Item',
              description: 'Test Description',
              category: 'Test Category',
              price: 10.0,
              image: 'http://example.com/image.jpg'
          });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("DELETE /items/:id", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Item, 'destroy').mockImplementation(() => { throw error; });

      const response = await request(app).delete('/items/1')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("GET /orders", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Order, 'findAll').mockImplementation(() => { throw error; });

      const response = await request(app).get('/orders')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("GET /orders/:id", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Order, 'findByPk').mockImplementation(() => { throw error; });

      const response = await request(app).get('/orders/1')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("POST /orders/", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Order, 'create').mockImplementation(() => { throw error; });

      const response = await request(app).post('/orders')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("POST /orders/:userId", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Order, 'findByPk').mockImplementation(() => { throw error; });

      const response = await request(app).post('/orders/1')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("PUT /orders/:id", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Order, 'findByPk').mockImplementation(() => { throw error; });

      const response = await request(app).put('/orders/1')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("DELETE /orders/:id", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(Order, 'destroy').mockImplementation(() => { throw error; });

      const response = await request(app).delete('/orders/1')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("GET /users", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(User, 'findAll').mockImplementation(() => { throw error; });

      const response = await request(app).get('/users')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("GET /users/:id", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(User, 'findByPk').mockImplementation(() => { throw error; });

      const response = await request(app).get('/users/1')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("GET /:id/orders", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(User, 'findByPk').mockImplementation(() => { throw error; });

      const response = await request(app).get('/users/1/orders')

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("POST /users", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(User, 'create').mockImplementation(() => { throw error; });

      const response = await request(app)
          .post('/users')
          .send({
              name: 'Test User',
              email: 'test@example.com',
              password: 'StrongPassword123!',
              cart: [],
              isAdmin: false
          });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("PUT /users/:id", () => {
  it("should call next(error) when an error occurs", async () => {
      const error = new Error('Test error');
      jest.spyOn(User, 'findByPk').mockImplementation(() => { throw error; });

      const response = await request(app)
          .put('/users/1')
          .send({
              name: 'Test User',
              email: 'test@example.com',
              password: 'StrongPassword123!',
              cart: [],
              isAdmin: false
          });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Test error');
  });
});

describe("PUT /users/:id/addToCart/:itemId", () => {
  it("should call next(error) when an error occurs", async () => {
    const error = new Error('Test error');
    jest.spyOn(User, 'findByPk').mockImplementation(() => { throw error; });

    const response = await request(app).put('/users/1/addToCart/1');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Test error');
  });
});

describe("PUT /users/:id/updateCart", () => {
  it("should call next(error) when an error occurs", async () => {
    const error = new Error('Test error');
    jest.spyOn(User, 'findByPk').mockImplementation(() => { throw error; });

    const response = await request(app).put('/users/1/updateCart');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Test error');
  });
});

describe("DELETE /users/:id/", () => {
  it("should call next(error) when an error occurs", async () => {
    const error = new Error('Test error');
    jest.spyOn(User, 'destroy').mockImplementation(() => { throw error; });

    const response = await request(app).delete('/users/1');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Test error');
  });
});