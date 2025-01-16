import * as fs from "fs";
import { query } from "express-validator";
import HotProduct from "../models/HotProduct";
export class HotProdController {
  static async addHotProd(req, res, next) {
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
      const hotProduct = await new HotProduct(data).save();
      res.status(201).send({
        msg: "Thêm sản phẩm thành công",
        hotProduct,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getHotProds(req, res, next) {
    try {
      let prods;
      const user = req.user;
      if (user.type == "admin") prods = await HotProduct.find();
      else prods = await HotProduct.find({ status: true });
      res.send(prods);
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
      const updatedProduct = await HotProduct.findByIdAndUpdate(
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

  // static async getShopByID(req, res, next) {
  //   try {
  //     const { shopId } = req.query;
  //     console.log("pppp", req.query);
  //     console.log("aâ", shopId);
  //     let shop = await Shop.findOne({ _id: shopId });
  //     console.log(shop);
  //     if (!shop) {
  //       return res.status(404).json({ message: "Lấy dữ liệu shop bị lỗi" });
  //     }

  //     res.status(200).json(shop);
  //   } catch (e) {
  //     next(e);
  //   }
  // }
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
      const updateHotProdStt = await HotProduct.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
      if (!updateHotProdStt) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
      }
      res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        prod: updateHotProdStt,
      });
    } catch (error) {
      next(error); // Truyền lỗi tới middleware xử lý lỗi
    }
  }
}
