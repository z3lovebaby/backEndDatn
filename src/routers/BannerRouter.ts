import { GlobalMiddleWare } from "./../middlewares/GlobalMiddleWare";
import { Router } from "express";
import { BannerController } from "../controllers/BannerController";
import { Utils } from "../utils/Utils";
import { BannerValidators } from "../validators/BannerValidators";

class BannerRouter {
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
    //   "/send/verification/email",
    //   GlobalMiddleWare.auth,
    //   UserController.resendVerificationEmail
    // );
    this.router.get(
      "/banners",
      GlobalMiddleWare.auth,
      BannerController.getBanners
    );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("bannerImages"),
      BannerValidators.addBanner(),
      GlobalMiddleWare.checkError,
      BannerController.addBanner
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new BannerRouter().router;
