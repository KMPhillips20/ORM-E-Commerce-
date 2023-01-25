const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
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


router.get('/:id', async (req, res) => {
  try {
    const products = await Product.findByPk(req.params.id, {
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

router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productsTag = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productsTag);
      }
      res.status(200).json(product);
    })
    .then((productsId) => res.status(200).json(productsId))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


router.put('/:id', async (req, res) => {
   await Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productId = productTags.map(({ tag_id }) => tag_id);
      const newPTags = req.body.tagIds
        .filter((tag_id) => !productId.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productRemove } }),
        ProductTag.bulkCreate(newPTags),
      ]);
    })
    .then((updatedProduct) => res.json(updatedProduct))
    .catch((err) => {
      res.status(400).json(err);
    });
});


module.exports = router;

