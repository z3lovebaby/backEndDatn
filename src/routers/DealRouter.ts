import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Router } from "express";
import { BankController } from "../controllers/BankController";
import { DealController } from "../controllers/DealController";

class DealRouter {
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
      "/getAll",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.checkError,
      DealController.getAllDeal
    );
    this.router.get(
      "/get-deal-detail",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.checkError,
      DealController.getDetail
    );
  }

  postRoutes() {
    this.router.post(
      "/add-new",
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      DealController.addNewDeal
    );
    this.router.post(
      "/update-deal",
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      DealController.updateDeal
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {
    this.router.delete(
      "/delete/:id",
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      DealController.deleteDeal
    );
  }
}

export default new DealRouter().router;
