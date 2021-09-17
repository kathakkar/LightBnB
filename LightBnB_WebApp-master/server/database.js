const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: '127.0.0.1',
  database: 'lightbnb'
});


const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((result) => {  
      user = result.rows;
      return user[0];
    })
    .catch((err) => {
      return err;
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(`SELECT * FROM users WHERE id = $1;`, [id])
  .then((result) => {  
    user = result.rows;
    return user[0];
  })
  .catch((err) => {
    return err;
  });
  //return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
  .query(`insert into users(name,email,password) values($1,$2,$3) RETURNING id;`, [user.name,user.email,user.password])
  .then((result) => {  
    user =  result.rows;
    return pool.query(`select * from users where id = $1;`,[user[0].id])
  })
  .then((result)=>{
    user = result.rows;
    return user[0];
  })
  .catch((err) => {
    return err;
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT properties.id, properties.title, properties.cost_per_night, properties.thumbnail_photo_url, properties.parking_spaces, 
    properties.number_of_bathrooms, properties.number_of_bedrooms, reservations.start_date,AVG(property_reviews.rating) as average_rating
    FROM reservations 
    JOIN properties ON property_id = properties.id
    JOIN users ON guest_id = users.id
    JOIN property_reviews ON reservation_id = reservations.id
    WHERE users.id = $1
    AND reservations.end_date < now()::date
    GROUP BY properties.id, properties.title, properties.cost_per_night, reservations.start_date
    ORDER BY properties.id DESC limit $2;`, [guest_id,limit])
    .then((result) => {  
      return result.rows;
    })
    .catch((err) => {
      return err.message;
    });
  //return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {  
      return result.rows;
    })
    .catch((err) => {
      return err.message;
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
