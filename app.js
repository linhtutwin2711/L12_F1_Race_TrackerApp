const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let nextId = 6;
let drivers = [
  { id: 1, name: 'Lewis Hamilton',   team: 'Mercedes',    engine: 'Mercedes',  nationality: 'British',    carNo: 44, points: 381, wins: 10, podiums: 17 },
  { id: 2, name: 'Nico Rosberg',     team: 'Mercedes',    engine: 'Mercedes',  nationality: 'German',     carNo: 6,  points: 385, wins: 9,  podiums: 16 },
  { id: 3, name: 'Daniel Ricciardo', team: 'Red Bull',    engine: 'TAG Heuer', nationality: 'Australian', carNo: 3,  points: 256, wins: 1,  podiums: 8  },
  { id: 4, name: 'Sebastian Vettel', team: 'Ferrari',     engine: 'Ferrari',   nationality: 'German',     carNo: 5,  points: 212, wins: 0,  podiums: 8  },
  { id: 5, name: 'Kimi Raikkonen',   team: 'Ferrari',     engine: 'Ferrari',   nationality: 'Finnish',    carNo: 7,  points: 186, wins: 0,  podiums: 6  },
];

// Screen 1 — Home
app.get('/', (req, res) => {
  res.render('index', { drivers });
});

// Drivers standings list
app.get('/drivers', (req, res) => {
  const standings = [...drivers].sort((a, b) => b.points - a.points);
  res.render('drivers', { standings });
});

// Screen 2 — Driver detail
app.get('/drivers/:id', (req, res) => {
  const driver = drivers.find(d => d.id === parseInt(req.params.id));
  if (!driver) return res.redirect('/');
  const sorted = [...drivers].sort((a, b) => b.points - a.points);
  const position = sorted.findIndex(d => d.id === driver.id) + 1;
  res.render('details', { driver, position });
});

// Screen 3 — Add driver
app.get('/add', (req, res) => {
  res.render('add', { errors: [], body: {} });
});

app.post('/add', (req, res) => {
  const { name, team, engine, nationality, carNo, points, wins, podiums } = req.body;
  const errors = [];
  if (!name)        errors.push('Driver name is required.');
  if (!team)        errors.push('Team is required.');
  if (!engine)      errors.push('Engine supplier is required.');
  if (!nationality) errors.push('Nationality is required.');
  if (!carNo)       errors.push('Car number is required.');
  if (errors.length) return res.render('add', { errors, body: req.body });

  drivers.push({
    id: nextId++, name, team, engine, nationality,
    carNo:   parseInt(carNo)   || 0,
    points:  parseInt(points)  || 0,
    wins:    parseInt(wins)    || 0,
    podiums: parseInt(podiums) || 0,
  });
  res.redirect('/');
});

// Screen 4 — Edit driver
app.get('/edit/:id', (req, res) => {
  const driver = drivers.find(d => d.id === parseInt(req.params.id));
  if (!driver) return res.redirect('/');
  res.render('edit', { driver, errors: [] });
});

app.post('/edit/:id', (req, res) => {
  const { name, team, engine, nationality, carNo, points, wins, podiums } = req.body;
  const errors = [];
  if (!name)        errors.push('Driver name is required.');
  if (!team)        errors.push('Team is required.');
  if (!engine)      errors.push('Engine supplier is required.');
  if (!nationality) errors.push('Nationality is required.');

  const driver = drivers.find(d => d.id === parseInt(req.params.id));
  if (!driver) return res.redirect('/');
  if (errors.length) return res.render('edit', { driver: { ...driver, ...req.body }, errors });

  const idx = drivers.findIndex(d => d.id === parseInt(req.params.id));
  drivers[idx] = {
    id: parseInt(req.params.id), name, team, engine, nationality,
    carNo:   parseInt(carNo)   || 0,
    points:  parseInt(points)  || 0,
    wins:    parseInt(wins)    || 0,
    podiums: parseInt(podiums) || 0,
  };
  res.redirect('/drivers/' + req.params.id);
});

// Screen 5 — Delete confirmation
app.get('/delete/:id', (req, res) => {
  const driver = drivers.find(d => d.id === parseInt(req.params.id));
  if (!driver) return res.redirect('/');
  res.render('delete', { driver });
});

app.post('/delete/:id', (req, res) => {
  drivers = drivers.filter(d => d.id !== parseInt(req.params.id));
  res.redirect('/');
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));