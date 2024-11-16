import * as jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/environment";
import * as crypto from "crypto";
export class Jwt {
  static jwtSign(payload, userId, expires_in: string = "20s") {
    return jwt.sign(payload, getEnvironmentVariables().jwt_secret_key, {
      expiresIn: expires_in,
      audience: userId.toString(),
      issuer: "technyks.com",
    });
  }

  static jwtVerify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret_key,
        (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error("User is not authorised."));
          else resolve(decoded);
        }
      );
    });
  }

  static jwtSignRF(payload, userId, expires_in: string = "10d") {
    return jwt.sign(payload, getEnvironmentVariables().jwt_refresh_secret_key, {
      expiresIn: expires_in,
      audience: userId.toString(),
      issuer: "technyks.com",
    });
  }

  static jwtVerifyRF(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getEnvironmentVariables().jwt_refresh_secret_key,
        (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error("User is not authorised."));
          else resolve(decoded);
        }
      );
    });
  }
}
