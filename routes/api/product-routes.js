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
    .then((productsTagIds) => res.status(200).json(productsTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});




