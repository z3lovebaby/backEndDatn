import { GlobalMiddleWare } from "./../middlewares/GlobalMiddleWare";
import { Router } from "express";
import { ShopeeController } from "../controllers/ShopeeController";

class ShopeeRouter {
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
  }

  postRoutes() {
    this.router.post(
      "/convert",
      GlobalMiddleWare.checkError,
      ShopeeController.convertLink
    );
  }

  patchRoutes() {
    // this.router.patch(
    //   "/reset/password",
    //   UserValidators.resetPassword(),
    //   GlobalMiddleWare.checkError,
    //   UserController.resetPassword
    // );
    // this.router.patch(
    //   "/verify/emailToken",
    //   GlobalMiddleWare.auth,
    //   UserValidators.verifyUserEmailToken(),
    //   GlobalMiddleWare.checkError,
    //   UserController.verifyUserEmailToken
    // );
    // this.router.patch(
    //   "/update/phone",
    //   GlobalMiddleWare.auth,
    //   UserValidators.verifyPhoneNumber(),
    //   GlobalMiddleWare.checkError,
    //   UserController.updatePhoneNumber
    // );
    // this.router.patch(
    //   "/update/profile",
    //   GlobalMiddleWare.auth,
    //   UserValidators.verifyUserProfile(),
    //   GlobalMiddleWare.checkError,
    //   UserController.updateUserProfile
    // );
  }

  putRoutes() {}

  deleteRoutes() {}
}

export default new ShopeeRouter().router;
