const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.send("<h1>What did the chainsaw say to the tree? Saw dude!</h1>")
});

module.exports = router;