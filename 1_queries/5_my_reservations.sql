SELECT properties.id, properties.title, properties.cost_per_night, reservations.start_date,AVG(property_reviews.rating) 
FROM reservations 
JOIN properties ON property_id = properties.id
JOIN users ON guest_id = users.id
JOIN property_reviews ON property_id = properties.id
WHERE users.id = 1; 