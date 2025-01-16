import { GlobalMiddleWare } from "./../middlewares/GlobalMiddleWare";
import { Router } from "express";
import { Utils } from "../utils/Utils";
import { ShopValidators } from "../validators/ShopValidators";
import { ShopController } from "../controllers/ShopController";
import { ProdValidators } from "../validators/ProdValidator";

class ShopRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get(
      "/get-shop",
      GlobalMiddleWare.auth,
      ShopController.getShopByID
    );
    this.router.get(
      "/get-prod/:shopId",
      GlobalMiddleWare.auth,
      ShopController.getProd
    );
    this.router.get("/shops", GlobalMiddleWare.auth, ShopController.getShops);
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("shopImages"),
      ShopValidators.addShop(),
      GlobalMiddleWare.checkError,
      ShopController.addShop
    );
    this.router.post(
      "/update/:id",
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      ShopController.updateStatus
    );

    this.router.post(
      "/add-prod",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("prodImage"),
      ProdValidators.addProd(),
      GlobalMiddleWare.checkError,
      ShopController.addProd
    );
    this.router.post(
      "/update-prod",
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("prodImage"),
      ShopController.updateProd
    );

    this.router.post(
      "/change-stt-prod/:id",
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      ShopController.updateSttProd
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new ShopRouter().router;
