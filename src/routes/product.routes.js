const { Router } = require('express');
const productController = require('../controllers/product.controller');
const upload = require('../utils/upload.middleware');
const { verifyToken } = require('../utils/auth.middleware');

const router = Router();

// router.use(verifyToken);

router.post('/', upload.single('imagen'), productController.createProduct);
router.post('/:id/imagen', upload.single('imagen'), productController.updateProductImage);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;