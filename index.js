
const express = require('express');
const DatastoreNEdb = require('nedb');

const app = express();

const databaseNEdb = new DatastoreNEdb('databaseNEdb.db');
databaseNEdb.loadDatabase();

const xfitNEdb = new DatastoreNEdb('xfitNEdb.db');
xfitNEdb.loadDatabase();


app.listen(3000, () => console.log('Up and listening on port 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.post('/api', (request, response) => {
    console.log(request.body);
    let data = request.body;
    let logTime = Date.now();
    data.timestamp = logTime;
    databaseNEdb.insert(data);
    response.json({
        status: 'success',
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp
    });
});

/*app.post('/xfit', (request, response) => {
    console.log(request.body);
    let data = request.body;
    let workoutCount = 1;
    data.forEach(item => {
        let workoutObject = {
            order: workoutCount,
            workoutDescription: item.workout,
            timesCompleted: 0,
            dateLastCompleted: []
        };
        xfitNEdb.insert(workoutObject);
        workoutCount = workoutCount + 1;
    });
    response.json({
        status: 'success',
        numberOfInserts: data.length,
        insertionsAttempted: workoutCount
    });
});*/

app.post('/nedb', (request, response) => {
    console.log(request.body);
    // Find all documents in the collection
    databaseNEdb.find({}, function (err, docs) {
        response.json(docs);
    });
});
