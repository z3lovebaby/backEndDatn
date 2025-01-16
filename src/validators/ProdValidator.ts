import { body } from "express-validator";

export class ProdValidators {
  static addProd() {
    return [
      body("prodImage", "Prod image is required").custom((prod, { req }) => {
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
