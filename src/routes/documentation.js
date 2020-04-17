const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const sidebar = require('../../content/docs/sidebar.json');
const docsFolder = path.join(__dirname, '../../content/docs');

const md = require('markdown-it')();

router.use((req, res, next) => {
    console.log(req.path);
    if (req.path.endsWith('.md')) {
        if (fs.existsSync(path.join(docsFolder, req.path))) {
            const raw = fs.readFileSync(path.join(docsFolder, req.path)).toString();

            console.log(raw);

            const rendered = md.render(raw);
            console.log(rendered);

            return res.render('docs', {content: rendered, sidebar})
        } else {
            return res.sendStatus(404);
        }

    } else {
        next();
    }
});

router.use('/', express.static(docsFolder, {

}))

/* GET home page. */
router.get('/', function (req, res) {
    return res.redirect('index.md')
});


module.exports = router;
