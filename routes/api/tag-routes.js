const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');



router.get('/', async (req, res) => {
   try {
    const tagged = await Tag.findAll({
      include: [{
        model: Product
      }]
    });
    res.json(tagged);
} catch (err) {
    console.error(err);
    res.json(err);
}
});

router.get('/:id', async (req, res) => {
  try {
    const tagged = await Tag.findByPk(req.params.id, {
        include: [{
            model: Product,
        }]
    });
    res.json(tagged);
} catch (err) {
    console.error(err);
    res.json(err);
}
});

router.post('/', async (req, res) => {
  try {
    const tagged = await Tag.create(req.body);
    res.json(tagged);
} catch (err) {
    console.error(err);
    res.json(err);
}
});

router.put('/:id', async (req, res) => {
  try {
    const tagged = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    if (!tagged[0]) {
      res.status(404).json({ message: 'NOT FOUND!' });
      return;
    }
    res.status(200).json(tagged);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
      const tagged = await Tag.destroy({ where: { id: req.params.id } });
      res.json(tagged);
  } catch (err) {
      console.error(err);
      res.json(err);
  }
});

module.exports = router;
