import * as fs from "fs";
import Shop from "../models/Shop";
import { query } from "express-validator";
export class ShopController {
  static async addShop(req, res, next) {
    try {
      // Kiểm tra nếu có file upload
      const normalizedPath = req.file
        ? req.file.path.replace(/\\/g, "/")
        : null;

      // Dữ liệu từ request body
      const data = {
        image: normalizedPath,
        name: req.body.name,
        rate: req.body.rate,
        followers: req.body.followers,
        address: req.body.address,
        link: req.body.link,
        status: true, // Mặc định là bật khi thêm mới
      };

      // Lưu shop vào database
      const shop = await new Shop(data).save();

      // Trả về phản hồi thành công
      res.status(201).send({
        msg: "Thêm shop thành công",
        shop,
      });
    } catch (e) {
      // Xử lý lỗi
      next(e);
    }
  }

  static async getShops(req, res, next) {
    try {
      let shops;
      const user = req.user;
      if (user.type == "admin") shops = await Shop.find();
      else shops = await Shop.find({ status: true });
      res.send(shops);
    } catch (e) {
      next(e);
    }
  }
  static async getShopByID(req, res, next) {
    try {
      const { shopId } = req.query;
      console.log("pppp", req.query);
      console.log("aâ", shopId);
      let shop = await Shop.findOne({ _id: shopId });
      console.log(shop);
      if (!shop) {
        return res.status(404).json({ message: "Lấy dữ liệu shop bị lỗi" });
      }

      res.status(200).json(shop);
    } catch (e) {
      next(e);
    }
  }
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log("rrrrr", req.body, id);
      // Kiểm tra ID và dữ liệu hợp lệ
      if (!id || !status) {
        return res.status(400).json({
          message: "Thông tin không hợp lệ.",
        });
      }
      const updateShop = await Shop.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
      if (!updateShop) {
        return res.status(404).json({ message: "Không tìm thấy shop." });
      }
      res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        shop: updateShop,
      });
    } catch (error) {
      next(error); // Truyền lỗi tới middleware xử lý lỗi
    }
  }
}
