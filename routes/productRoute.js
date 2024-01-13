const express = require('express');

const router = express.Router();

const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth');

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route('/products').get(getAllProducts);

router.route('/product/:id').get(getProductDetails);

router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;