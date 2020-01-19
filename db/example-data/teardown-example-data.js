const path = require('path');
const fs = require('fs');

const dbLocation = path.join(__dirname, '../db.sqlite');
const backupLocation = path.join(__dirname, `../db.real.sqlite`);

if (fs.existsSync(dbLocation))
    fs.renameSync(backupLocation, dbLocation);

console.log('done');
