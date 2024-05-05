const {client,
    createTables,
    createCustomers,
    createRestaurants,
    fetchCustomers,
    fetchRestauraunts,
    createReservations,
    fetchReservations,
    destroyReservations,
} = require('./db');

const express = require('express');
const app = express();

app.use = require('express');
app.use(require('morgan')('dev'));

//READ CUSTOMERS
app.get('/api/customers', async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});

//READ RESTAURAUNTS
app.get('/api/restauraunts', async (req, res, next) => {
  try {
    res.send(await fetchRestauraunts());
  } catch (error) {
    next(error);
  }
});

//READ RESERVATIONS
app.get('/api/reservations', async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    next(error);
  }
});

//DELETE RESERVATIONS
app.delete('/api/customers/:customer_id/reservations/:id',
  async(req, res, next) => {
    try {
      await destroyReservations({customer_id: req.params.customer_id, id: req.params.id});
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

//UPDATE RESERVATIONS
app.post('api/customers/:customer_id/reservations', async (req, res, next) => {
  try {
    res.status(201).send(await createReservations({
      customer_id: req.params.customer_id,
      restauraunt_id: req.body.restauraunt_id,
      eat_date: req.body.eat_date,
    }));
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  await client.connect();
  
  await createTables();
  console.log('tables created');

  const [nick, sophia, katherine, burger, pizza, steak]
  = await Promise.all([
    createCustomers({name:'nick'}),
    createCustomers({name:'sophia'}),
    createCustomers({name:'katherine'}),
    createRestaurants({name:'burger'}),
    createRestaurants({name:'pizza'}),
    createRestaurants({name:'steak'}),
  ]);

  console.log('data seeded');

  console.log(await fetchCustomers());
  console.log(await fetchRestauraunts());

  const [reservation, reservation2] = await Promise.all([
    createReservations({
      customer_id: nick.id,
      restauraunt_id: burger.id,
      party_count: 5,
      eat_date: '03/26/2025'
    }),
    createReservations({
      customer_id: nick.id,
      restauraunt_id: burger.id,
      party_count: 8,
      eat_date: '04/05/2025'
    }),
  ]);
  console.log('vacations created');
  console.log(await fetchReservations());

  // await destroyReservations({id: reservation.id, customer_id: reservation.customer_id});
  // console.log(await fetchReservations());

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();