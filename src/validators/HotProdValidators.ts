import { body } from "express-validator";

export class HotProdValidators {
  static addHotProd() {
    return [
      body("hotProdImage", "Prod image is required").custom((shop, { req }) => {
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
