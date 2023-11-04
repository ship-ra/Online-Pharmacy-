import express from "express";
import {
  brainTreePaymentController,
  braintreeTokenController,
  calculateTotalPriceController,
  checkout,
  createProductController,
  createProductReviewController,
  deleteProductController,
  deleteProductReviewsController,
  failedPayment,
  getProductController,
  getProductReviewsController,
  getSingleProductController,
  orderCountController,
  paymentVerification,
  prescription,
  prescriptionPhotoController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  userCountController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import { VisaCheckoutCard } from "braintree";

const router = express.Router();

//create product route
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.post(
  "/prescription",
  requireSignIn,
  formidable(),
  prescription
);

//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//get prescription photo
router.get("/prescription-photo/:id", prescriptionPhotoController);


//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

//create Reviews
router.put('/review/:pid', requireSignIn,createProductReviewController)

//Get Reviews
router.get('/reviews/:pid', getProductReviewsController)

//Delete reviews
router.delete('/delete-review/:pid/:id', requireSignIn, deleteProductReviewsController)

//RAZORPAY
router.post('/razorpay/order',requireSignIn,checkout)

//RAZORPAY
router.post('/paymentverification',requireSignIn,paymentVerification)

//Failed Payment 
router.post('/paymentfailure',requireSignIn,failedPayment)

//Count all users
router.get('/user-count', userCountController)

//Count all Orders
router.get('/order-count', orderCountController)

//Total Sale
router.get('/total-price', calculateTotalPriceController)

export default router;