const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryInfo = await Category.findAll({
      include: [
        { model: Product }
      ]
    });
    res.json(categoryInfo);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const categoryInfo = await Category.findByPk(req.params.id, {
        include: [
          { model: Product }
        ]
    });
    res.json(categoryInfo);
} catch (err) {
    console.error(err);
    res.json(err);
}
});

router.post('/', async (req, res) => {
  try {
    const categoryInfo = await Category.create(req.body);
    res.json(categoryInfo);
} catch (err) {
    console.error(err);
    res.json(err);
}
});

router.put('/:id', async (req, res) => {
  try {
    const categoryInfo = await Category.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    if (!categoryInfo[0]) {
      res.status(404).json({ message: 'CATEGORY NOT FOUND!' });
      return;
    }
    res.status(200).json(categoryInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryInfo = await Category.destroy({ where: { id: req.params.id } });
    res.json(categoryInfo);
} catch (err) {
    console.error(err);
    res.json(err);
}
});

module.exports = router;
