const db = require('../config/db');

exports.addSchool = (req, res) => {
     const { name, address, latitude, longitude } = req.body;

     if (!name || !address || !latitude || !longitude) {
          return res.status(400).json({ message: 'All fields are required' });
     }

     const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?,?, ?, ?)';
     db.query(query, [name, address, latitude, longitude], (err, result) => {
          if (err) {
               return res.status(500).json({ message: 'Database error', error: err });
          }
          res.status(201).json({ message: 'School added successfully' });
     });
};

exports.listSchools = (req, res) => {
     const { latitude, longitude } = req.query;

     if (!latitude || !longitude) {
          return res.status(400).json({ message: 'Latitude and longitude are required' });
     }

     const query = 'SELECT id, name, address, latitude, longitude FROM schools';
     db.query(query, (err, results) => {
          if (err) {
               return res.status(500).json({ message: 'Database error', error: err });
          }

          const schoolsWithDistance = results.map(school => {
               const distance = calculateDistance(latitude, longitude, school.latitude, school.longitude);
               return { ...school, distance };
          });

          schoolsWithDistance.sort((a, b) => a.distance - b.distance);

          res.json(schoolsWithDistance);
     });
};

function calculateDistance(lat1, lon1, lat2, lon2) {
     const toRad = value => (value * Math.PI) / 180;

     const R = 6371; // Radius of the Earth in km
     const dLat = toRad(lat2 - lat1);
     const dLon = toRad(lon2 - lon1);

     const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);

     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     return R * c; // Distance in km
}
