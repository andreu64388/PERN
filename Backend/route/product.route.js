import { Router } from "express";
import ProductController from "../сontroller/product.controller.js";

const router = Router();

router.get("/product/getproducts", ProductController.GetProducts);
router.get("/product/getproduct/:id", ProductController.GetProduct);
router.post("/product/addcomment", ProductController.AddComment);
router.put("/product/updatecomment", ProductController.UpdateComment);
router.delete("/product/deletecomment", ProductController.DeleteComment);
router.post("/product/addbasket", ProductController.AddToBasket);
router.delete("/product/deletebasket", ProductController.DeleteFromBasket);
router.get("/product/getbasket/:id", ProductController.GetBasket);
router.post("/product/addorder", ProductController.AddOrder);
router.get("/product/getorders/:id", ProductController.GetOrders);
router.delete("/product/deleteallbasket", ProductController.DeleteAllBasket);
router.get("/product/gettoppersons", ProductController.GetPersons);
router.put("/product/updateorder", ProductController.UpdateOrder);

export default router;
