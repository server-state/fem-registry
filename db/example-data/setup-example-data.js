const path = require('path');
const cbms = require('./cbms');
const images = require('./images');
const maintainers = require('./maintainers');
const publishers = require('./publishers');
const releases = require('./releases');

const fs = require('fs');

const dbLocation = path.join(__dirname, '../db.sqlite');

async function setup() {
    if (fs.existsSync(dbLocation))
        fs.unlinkSync(dbLocation);

    const CBM = require('../../model/CBM');
    const Image = require('../../model/Image');
    const Maintainer = require('../../model/Maintainer');
    const Publisher = require('../../model/Publisher');
    const Release = require('../../model/Release');

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

    for (let cbm of cbms) {
        const c = new CBM();
        for (let key in cbm) {
            if (cbm.hasOwnProperty(key))
                c[key] = cbm[key]
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
        await i.save();
    }
}

setup();
