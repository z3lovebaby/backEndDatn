import { GlobalMiddleWare } from "./../middlewares/GlobalMiddleWare";
import { Router } from "express";
import { Utils } from "../utils/Utils";
import { QuanLyDonValidator } from "../validators/QuanLyDonValidator";
import { QuanLyDonController } from "../controllers/QuanLyDonController";

class QuanLyDonRouter {
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
      "/orderItems",
      GlobalMiddleWare.auth,
      QuanLyDonController.getOrderItems
    );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("fileAffReport"),
      QuanLyDonValidator.addOrderByFile(),
      GlobalMiddleWare.checkError,
      QuanLyDonController.addOrderByFile
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new QuanLyDonRouter().router;
