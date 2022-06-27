const express = require("express");
const Joi = require("joi");

// Create an express application
const app = express();
app.use(express.json());

// Data stored on server
const customers = [
  {
    title: "George",
    id: 1,
  },
  {
    title: "Lucas",
    id: 2,
  },
  {
    title: "Luke",
    id: 3,
  },
  {
    title: "Anakin",
    id: 4,
  },
  {
    title: "Obi",
    id: 5,
  },
];

// Read request handlers
app.get("/", (req, res) => {
  res.send("Welcome to REST API");
});

app.get("/api/customers", (req, res) => {
  res.send(customers);
});

app.get("/api/customers/:id", (req, res) => {
  const customer = customers.find((customer) => {
    return customer.id === parseInt(req.params.id);
  });

  if (!customer)
    res.status(404).send(`Customer with id ${req.params.id} not found`);
  res.send(customer);
});

app.post("/api/customers", (req, res) => {
  const { error } = validateCustomer(req.body);

  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }
  const customer = {
    id: customers.length + 1,
    title: req.body.title,
  };

  customers.push(customer);
  res.send(customer);
});

app.put("/api/customers/:id", (req, res) => {
  const customer = customers.find((customer) => {
    return customer.id === parseInt(req.params.id);
  });

  if (!customer) {
    res.status(404).send(`Customer with id ${req.params.id} does not exist`);
    return;
  }

  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }

  customer.title = req.body.title;
  res.send(customer);
});

app.delete("/api/customers/:id", (req, res) => {
  const customer = customers.find((customer) => {
    return customer.id === parseInt(req.params.id);
  });

  if (!customer) {
    res.status(404).send(`Customer with id ${req.params.id} does not exist`);
    return;
  }

  customers.splice(customers.indexOf(customer), 1);
  res.send(customer);
});

function validateCustomer(customer) {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .required(),
  });

  return schema.validate(customer);
  //   return Joi.validate(customer, schema);
}

// PORT environment variable
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
