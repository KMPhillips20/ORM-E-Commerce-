const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
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


router.get('/:id', (req, res) => {
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

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
