const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        model: Tag,
      }]
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});



