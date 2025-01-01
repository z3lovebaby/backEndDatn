import Banner from "../models/Banner";
import * as fs from "fs";
export class BannerController {
  static async addBanner(req, res, next) {
    console.log("filee:", req.body.link, req.body.file);
    const normalizedPath = req.file.path.replace(/\\/g, "/");
    try {
      const data = {
        banner: normalizedPath,
        link: req.body.link,
      };
      const banner = await new Banner(data).save();
      res.send(banner);
    } catch (e) {
      next(e);
    }
  }

  static async getBanners(req, res, next) {
    try {
      const banners = await Banner.find();
      res.send(banners);
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
      const updatedBanner = await Banner.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
      if (!updatedBanner) {
        return res.status(404).json({ message: "Banner not found." });
      }
      res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        banner: updatedBanner,
      });
    } catch (error) {
      next(error); // Truyền lỗi tới middleware xử lý lỗi
    }
  }
}
