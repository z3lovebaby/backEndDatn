import * as fs from "fs";
import Shop from "../models/Shop";
import { query } from "express-validator";
import ProductOfShop from "../models/ProductOfShop";
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
      // console.log("pppp", req.query);
      // console.log("aâ", shopId);
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
  static async getProd(req, res, next) {
    try {
      const user = req.user;
      const { shopId } = req.params;
      console.log(req.params);
      if (!shopId) {
        return res.status(400).json({
          message: "Shop ID không hợp lệ.",
        });
      }
      let prods;
      if (user.type == "admin")
        prods = await ProductOfShop.find({ shop: shopId });
      else prods = await ProductOfShop.find({ shop: shopId, status: true });

      res.send(prods);
    } catch (error) {
      next(error);
    }
  }

  static async addProd(req, res, next) {
    try {
      const normalizedPath = req.file
        ? req.file.path.replace(/\\/g, "/")
        : null;
      const data = {
        image: normalizedPath,
        name: req.body.name,
        shop: req.body.shop,
        price: req.body.price,
        commission: req.body.commission,
        link: req.body.link,
        category: req.body.category,
        status: true,
      };
      const hotProduct = await new ProductOfShop(data).save();
      res.status(201).send({
        msg: "Thêm sản phẩm thành công",
        hotProduct,
      });
    } catch (e) {
      next(e);
    }
  }

  static async updateProd(req, res, next) {
    try {
      const { id } = req.body;
      let updatedData = req.body;
      console.log("data:", updatedData, req.body);
      if (req.file) {
        // Nếu có file ảnh mới, cập nhật lại đường dẫn ảnh
        const normalizedPath = req.file.path.replace(/\\/g, "/");
        updatedData.image = normalizedPath;
      }

      // Cập nhật sản phẩm trong DB
      const updatedProduct = await ProductOfShop.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );

      res.status(200).send({
        msg: "Cập nhật sản phẩm thành công",
        product: updatedProduct,
      });
    } catch (e) {
      next(e);
    }
  }

  static async updateSttProd(req, res, next) {
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
      const updateSttProd = await ProductOfShop.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
      if (!updateSttProd) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
      }
      res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        prod: updateSttProd,
      });
    } catch (error) {
      next(error); // Truyền lỗi tới middleware xử lý lỗi
    }
  }
}
