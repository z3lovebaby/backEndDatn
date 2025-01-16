import { GlobalMiddleWare } from "./../middlewares/GlobalMiddleWare";
import { Router } from "express";
import { Utils } from "../utils/Utils";
import { HotProdValidators } from "../validators/HotProdValidators";
import { HotProdController } from "../controllers/HotProdController";

class HotProductRouter {
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
    // this.router.get(
    //   "/get-shop",
    //   GlobalMiddleWare.auth,
    //   ShopController.getShopByID
    // );
    this.router.get(
      "/prods",
      GlobalMiddleWare.auth,
      HotProdController.getHotProds
    );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("hotProdImage"),
      HotProdValidators.addHotProd(),
      GlobalMiddleWare.checkError,
      HotProdController.addHotProd
    );
    this.router.post(
      "/update",
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("hotProdImage"),
      HotProdController.updateProd
    );
    this.router.post(
      "/changestt/:id",
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      HotProdController.updateStatus
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new HotProductRouter().router;
