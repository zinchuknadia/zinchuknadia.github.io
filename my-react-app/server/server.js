// server/server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db } = require('./firebase');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// 🔹 GET: Отримати покращені будівлі
app.get('/api/builtBuildings', async (req, res) => {
  try {
    const snapshot = await db.collection('builtBuildings').get();
    const builtBuildings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // console.log('➡️ buildings from Firebase:', builtBuildings);
    res.json(builtBuildings);
  } catch (err) {
    // console.error('❌ Error fetching buildings from Firestore:', err);
    res.status(500).json({ error: 'Error getting buildings data' });
  }
});
// 🔹 POST: Зберегти покращення будівлі (1 раз на хвилину)
const lastUpdateTime = {}; // об'єкт для відстеження часу

app.post('/api/builtBuildings/:id/upgrade', async (req, res) => {
  const buildingId = req.params.id;
  const now = Date.now();
  const lastTime = lastUpdateTime[buildingId] || 0;

  if (now - lastTime < 60000) {
    return res.status(429).json({ error: 'Can only upgrade once per minute' });
  }

  try {
    const newData = req.body;
    await db.collection('builtBuildings').doc(buildingId).set(newData, { merge: true });
    lastUpdateTime[buildingId] = now;
    res.json({ message: 'Building upgraded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving building data' });
  }
});

// Віддаємо React-білд із клієнтської частини
app.use(express.static(path.join(__dirname, '../client/build')));

// Статичні файли
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
