import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Router } from "express";
import { BankController } from "../controllers/BankController";

class BankRouter {
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
      "/getAllContract",
      GlobalMiddleWare.auth,
      BankController.getAllContract
    );
    this.router.get("/get-in4", GlobalMiddleWare.auth, BankController.getInfor);
  }

  postRoutes() {
    this.router.post(
      "/tao-lenh-rut",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.checkError,
      BankController.taoLenhRut
    );
    this.router.post(
      "/update-lenh-rut",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.checkError,
      BankController.updateLenhRut
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new BankRouter().router;
