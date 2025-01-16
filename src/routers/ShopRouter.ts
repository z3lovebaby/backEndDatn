import { GlobalMiddleWare } from "./../middlewares/GlobalMiddleWare";
import { Router } from "express";
import { Utils } from "../utils/Utils";
import { ShopValidators } from "../validators/ShopValidators";
import { ShopController } from "../controllers/ShopController";

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
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new ShopRouter().router;
