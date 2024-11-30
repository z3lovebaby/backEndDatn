import { body } from "express-validator";

export class QuanLyDonValidator {
  static addOrderByFile() {
    return [
      body("fileAffReport", "File csv report is required").custom(
        (order, { req }) => {
          if (req.file) {
            return true;
          } else {
            // throw new Error('File not uploaded');
            throw "File not uploaded";
          }
        }
      ),
    ];
  }
}
