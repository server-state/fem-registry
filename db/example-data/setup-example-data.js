const path = require('path');
const fems = require('./fems.json');
const images = require('./images.json');
const maintainers = require('./maintainers.json');
const publishers = require('./publishers.json');
const releases = require('./releases.json');

const fs = require('fs');

const dbLocation = path.join(__dirname, '../db.sqlite');
const backupLocation = path.join(__dirname, `../db.real.sqlite`);

async function setup() {
    if (fs.existsSync(dbLocation))
        fs.renameSync(dbLocation, backupLocation);

    const FEM = require('../../src/model/FEM');
    const Image = require('../../src/model/Image');
    const Maintainer = require('../../src/model/Maintainer');
    const Publisher = require('../../src/model/Publisher');
    const Release = require('../../src/model/Release');

    for (let publisher of publishers) {
        const p = new Publisher();
        for (let key in publisher) {
            if (publisher.hasOwnProperty(key))
                p[key] = publisher[key]
        }
        await p.setPassword(publisher.password);
        await p.save();
    }

    for (let maintainer of maintainers) {
        const m = new Maintainer();
        for (let key in maintainer) {
            if (maintainer.hasOwnProperty(key))
                m[key] = maintainer[key]
        }
        await m.setPassword(maintainer.password);
        await m.save();
    }

    for (let fem of fems) {
        const c = new FEM();
        for (let key in fem) {
            if (fem.hasOwnProperty(key))
                c[key] = fem[key]
        }
        await c.save();
    }

    for (let release of releases) {
        const r = new Release();
        for (let key in release) {
            if (release.hasOwnProperty(key))
                r[key] = release[key]
        }
        await r.save();
    }

    for (let image of images) {
        const i = new Image();
        for (let key in image) {
            if (image.hasOwnProperty(key))
                i[key] = image[key]
        }
        i.data = fs.readFileSync(path.join(__dirname, 'img1.png'));
        await i.save();
    }
}

setup().then(() => console.log('Done')).catch(reason => console.error(reason));
