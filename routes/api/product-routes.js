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

// create new product
/* req.body should look like this...
  {
    product_name: "Jordan Shoes",
    price: 300.00,
    stock: 2,
    category_id: 
    tagIds: [1, 2, 3, 4]
  }
*/


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
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productId = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newPTags = req.body.tagIds
        .filter((tag_id) => !productId.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productRemove } }),
        ProductTag.bulkCreate(newPTags),
      ]);
    })
    .then((updatedProduct) => res.json(updatedProduct))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


module.exports = router;

