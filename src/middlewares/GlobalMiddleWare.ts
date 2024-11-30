import { Jwt } from "./../utils/Jwt";
import { validationResult } from "express-validator";

export class GlobalMiddleWare {
  static checkError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  }

  static async auth(req, res, next) {
    const header_auth = req.headers.authorization; //Bearer token
    // const token = header_auth ? header_auth.slice(7, header_auth.length) : null;
    const authHeader = header_auth.split(" ");
    const token = authHeader[1];
    console.log("token", token);
    console.log(!token);
    try {
      if (!token) {
        req.errorStatus = 401;
        next(new Error("User doesn't exist"));
      }
      const decoded = await Jwt.jwtVerify(token);
      req.user = decoded;
      next();
    } catch (e) {
      console.log("1111");
      req.errorStatus = 401;
      // next(e);
      next(new Error("User doesn't exist"));
    }
  }
  static adminRole(req, res, next) {
    const user = req.user;
    console.log("user: ", user);
    if (user.type !== "admin") {
      req.errorStatus = 401;
      next(new Error("Youu are an Unauthorised User"));
    }
    next();
  }
}
