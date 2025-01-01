import { body } from "express-validator";

export class ShopValidators {
  static addShop() {
    return [
      body("shopImages", "Shop image is required").custom((shop, { req }) => {
        if (req.file) {
          return true;
        } else {
          // throw new Error('File not uploaded');
          throw "File not uploaded";
        }
      }),
    ];
  }
}
