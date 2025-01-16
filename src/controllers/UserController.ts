import { Jwt } from "./../utils/Jwt";
import { NodeMailer } from "./../utils/NodeMailer";
import { Utils } from "./../utils/Utils";
import User from "../models/User";
import UserOrder from "../models/UserOrder";
import OrderShopee from "../models/OrderShopee";
import LenhRut from "../models/LenhRut";

export class UserController {
  static async signup(req, res, next) {
    console.log("req: ", req);
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const verification_token = Utils.generateVerificationToken();

    try {
      const hash = await Utils.encryptPassword(password);
      const data = {
        email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        phone,
        password: hash,
        name,
        type,
        status,
      };
      let user = await new User(data).save();
      const payload = {
        // user_id: user._id,
        // aud: user._id,
        email: user.email,
        type: user.type,
      };
      const access_token = Jwt.jwtSign(payload, user._id);
      const refresh_token = Jwt.jwtSignRF(payload, user._id);
      res.json({
        token: access_token,
        refreshToken: refresh_token,
        user: user,
      });
      // send email to user for verification
      await NodeMailer.sendMail({
        to: [user.email],
        subject: "Email Verification",
        html: `<h1>Your Otp is ${verification_token}</h1>`,
      });
      console.log("abcd");
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async verifyUserEmailToken(req, res, next) {
    const verification_token = req.body.verification_token;
    const email = req.user.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        {
          email_verified: true,
          updated_at: new Date(),
        },
        {
          new: true,
        }
      );
      if (user) {
        res.send(user);
      } else {
        throw new Error(
          "Wrong Otp or Email Verification Token Is Expired. Please try again..."
        );
      }
    } catch (e) {
      next(e);
    }
  }

  static async resendVerificationEmail(req, res, next) {
    const email = req.user.email;
    const verification_token = Utils.generateVerificationToken();
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      console.log("aa", user);
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Resend Email Verification",
          html: `<h1>Your Otp is ${verification_token}</h1>`,
        });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    const user = req.user;
    const password = req.query.password;
    const data = {
      password,
      encrypt_password: user.password,
    };
    try {
      await Utils.comparePassword(data);
      const payload = {
        // user_id: user._id,
        // aud: user._id,
        email: user.email,
        type: user.type,
      };
      console.log("payload:", payload);
      const access_token = Jwt.jwtSign(payload, user._id);
      const refresh_token = Jwt.jwtSignRF(payload, user._id);
      res.json({
        token: access_token,
        refreshToken: refresh_token,
        user: user,
      });
    } catch (e) {
      next(e);
    }
  }

  static async sendResetPasswordOtp(req, res, next) {
    const email = req.query.email;
    const reset_password_token = Utils.generateVerificationToken();
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          reset_password_token: reset_password_token,
          reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Reset password email vertification OTP",
          html: `<h1>Your Otp is ${reset_password_token}</h1>`,
        });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static verifyResetPasswordToken(req, res, next) {
    res.json({ success: true });
  }

  static async resetPassword(req, res, next) {
    const user = req.user;
    const new_password = req.body.new_password;
    try {
      const encryptedPassword = await Utils.encryptPassword(new_password);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          updated_at: new Date(),
          password: encryptedPassword,
        },
        { new: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async profile(req, res, next) {
    const user = req.user;
    try {
      const profile = await User.findById(user.aud);
      if (profile) {
        console.log(profile);
        res.send(profile);
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }
  static async getSoDu(req, res, next) {
    try {
      const user = req.user;

      // Tìm UserOrder theo user_id
      const userOrder = await UserOrder.findOne({ user_id: user.aud });
      if (!userOrder) {
        return res.status(404).json({
          error: "Không tìm thấy thông tin đơn hàng của người dùng.",
        });
      }
      // Lấy danh sách các orderID từ UserOrder
      const orderIds = userOrder.orders;
      console.log("o", orderIds);
      // Tìm các bản ghi OrderShopee tương ứng
      const orders = await OrderShopee.find({ _id: { $in: orderIds } });
      let sd = 0;
      let sdkd = 0;
      orders.forEach((order) => {
        sd += order.commission; // Lấy _id của từng đơn hàng

        // Kiểm tra nếu orderId chưa có trong danh sách orders, thì thêm vào
        if (order.status == "Hoàn thành") {
          sdkd += order.commission;
        }
      });
      const contracts = await LenhRut.find({ user_id: user.aud });
      contracts.forEach((con) => {
        sd -= con.money;
        sdkd -= con.money;
      });
      sd < 0 ? (sd = 0) : (sd = sd);
      sdkd < 0 ? (sdkd = 0) : (sdkd = sdkd);
      const _user = await User.findById(user.aud);
      console.log("go", _user.gift);
      res.send({
        soDu: sd + _user.gift,
        soDuKhaDung: sdkd + _user.gift,
      });
    } catch (e) {
      next(e);
    }
  }
  static async updatePhoneNumber(req, res, next) {
    const user = req.user;
    const phone = req.body.phone;
    try {
      const userData = await User.findByIdAndUpdate(
        user.aud,
        { phone: phone, updated_at: new Date() },
        { new: true }
      );
      res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  static async updateUserProfile(req, res, next) {
    const user = req.user;
    const phone = req.body.phone;
    const new_email = req.body.email;
    const plain_password = req.body.password;
    const verification_token = Utils.generateVerificationToken();
    try {
      const userData = await User.findById(user.aud);
      if (!userData) throw new Error("User doesn't exist");
      await Utils.comparePassword({
        password: plain_password,
        encrypt_password: userData.password,
      });
      const updatedUser = await User.findByIdAndUpdate(
        user.aud,
        {
          phone: phone,
          email: new_email,
          email_verified: false,
          verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
          updated_at: new Date(),
        },
        { new: true }
      );
      const payload = {
        // aud: user.aud,
        email: updatedUser.email,
        type: updatedUser.type,
      };
      const access_token = Jwt.jwtSign(payload, user._id);
      const refresh_token = Jwt.jwtSignRF(payload, user._id);
      res.json({
        token: access_token,
        refreshToken: refresh_token,
        user: user,
      });
      // send email to user for updated email verification
      await NodeMailer.sendMail({
        to: [updatedUser.email],
        subject: "Email Verification",
        html: `<h1>Your Otp is ${verification_token}</h1>`,
      });
    } catch (e) {
      next(e);
    }
  }
  static async getNewTokens(req, res, next) {
    const refreshToken = req.body.refreshToken;
    try {
      const decoded_data = await Jwt.jwtVerifyRF(refreshToken);
      if (decoded_data) {
        const payload = {
          // user_id: decoded_data.aud,
          email: decoded_data.email,
          type: decoded_data.type,
        };
        const access_token = Jwt.jwtSign(payload, decoded_data.aud);
        const refresh_token = Jwt.jwtSignRF(payload, decoded_data.aud);
        res.json({
          accessToken: access_token,
          refreshToken: refresh_token,
        });
      } else {
        req.errorStatus = 403;
        // throw new Error('Access is forbidden');
        throw "Access is forbidden";
      }
    } catch (e) {
      req.errorStatus = 403;
      next(e);
    }
  }
  static async vqmm(req, res, next) {
    try {
      const user = req.user;
      const { gift } = req.body;

      const _user = await User.findById(user.aud);

      if (!_user) {
        return res.status(404).json({ message: "User not found" });
      }

      _user.gift += gift;
      _user.luotQuay = 0;

      await _user.save();

      return res
        .status(200)
        .json({ message: "User updated successfully", user: _user });
    } catch (e) {
      next(e);
    }
  }
}
