const pg = require('pg');
const client = new pg.Client(
    process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner_34'
);

const uuid = require('uuid');

const createTables = async () => {
    const SQL = `--sql
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restauraunts;

    CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
    );

    CREATE TABLE restauraunts(
        id UUID PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
    );

    CREATE TABLE reservations(
        id UUID PRIMARY KEY,
        eat_date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL,
        restauraunt_id UUID REFERENCES restauraunts(id) NOT NULL
    );
    `;
    await client.query(SQL);
};

const createCustomers = async (name) => {
    const SQL = `--sql
    INSERT INTO customers(id, name) VALUES($1, $2)
    RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createRestaurants = async (name) => {
    const SQL = `--sql
    INSERT INTO restauraunts(id, name) VALUES($1, $2)
    RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const fetchCustomers = async () => {
    const SQL = `SELECT * FROM customers`;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchRestauraunts = async () => {
    const SQL = `SELECT * FROM restauraunts`;
    const response = await client.query(SQL);
    return response.rows;
};

const createReservations = async ({restauraunt_id, customer_id, eat_date, party_count}) => {
    const SQL = `--sql
    INSERT INTO reservations(id, restauraunt_id, customer_id, eat_date, party_count)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `;
const response = await client.query(SQL, [uuid.v4(), restauraunt_id, customer_id, eat_date, party_count]);
return response.rows[0];
};

const fetchReservations = async () => {
    const SQL = `SELECT * from reservations`;
    const response = await client.query(SQL);
    return response.rows;
};

const destroyReservations = async ({id, customer_id}) => {
    console.log(id, customer_id);
    const SQL = `--sql
    DELETE from reservations
    WHERE id=$1 AND customer_id=$2
    `;
    await client.query(SQL, [id, customer_id])
};

module.exports = {
    client,
    createTables,
    createCustomers,
    createRestaurants,
    fetchCustomers,
    fetchRestauraunts,
    createReservations,
    fetchReservations,
    destroyReservations,
};

