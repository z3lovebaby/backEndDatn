import * as fs from "fs";
import LenhRut from "../models/LenhRut";
import * as mongoose from "mongoose";
import Deal from "../models/Deal";
export class DealController {
  static async getAllDeal(req, res, next) {
    try {
      const { title } = req.query; // Lấy tham số title từ query
      const filter: {
        isDeleted: boolean;
        name?: { $regex: string; $options: string };
      } = {
        isDeleted: false,
      };
      console.log(filter);
      if (title) {
        filter.name = { $regex: title, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
      }

      const deals = await Deal.find(filter, "name _id isDeleted").sort({
        createdAt: -1, // Sắp xếp giảm dần theo thời gian tạo
      });

      res.status(200).json(deals);
    } catch (e) {
      next(e); // Chuyển lỗi đến middleware xử lý lỗi
    }
  }

  static async getDetail(req, res, next) {
    try {
      console.log("pppp", req.query);
      const id = req.query.id;
      const deal = await Deal.findOne({ _id: id, isDeleted: false });
      if (!deal) {
        return res
          .status(404)
          .json({ message: "List deal này không tồn tại hoặc đã bị xóa" });
      }

      res.status(200).json(deal);
    } catch (e) {
      next(e);
    }
  }

  static async addNewDeal(req, res, next) {
    try {
      // Extract data from the request body
      console.log(req.body);
      const { name, titles } = req.body;

      // Validate required fields
      if (!name || !titles || !Array.isArray(titles)) {
        return res
          .status(400)
          .json({ message: "Invalid input. Name and titles are required." });
      }

      // Validate each title and its items
      for (const title of titles) {
        console.log(typeof title, title.title, title.items);
        if (!title.title || !Array.isArray(title.items)) {
          return res.status(400).json({
            message:
              "Each title must be an object with a valid title and an array of items.",
          });
        }

        for (const item of title.items) {
          // No fields are required in items; skip validation here
          if (typeof item !== "object") {
            return res.status(400).json({
              message: "Each item must be an object.",
            });
          }
        }
      }

      // Create a new deal document
      const newDeal = new Deal({ name, titles });

      // Save the deal to the database
      const savedDeal = await newDeal.save();

      // Respond with the saved deal
      res.status(201).json({
        message: "Deal added successfully.",
        deal: savedDeal,
      });
    } catch (error) {
      // Pass any errors to the error-handling middleware
      next(error);
    }
  }
  static async updateDeal(req, res, next) {
    try {
      const { dataForm, dealId } = req.body;
      console.log(dataForm, dealId);
      if (
        !dealId ||
        !dataForm ||
        !dataForm.name ||
        !Array.isArray(dataForm.titles)
      ) {
        return res.status(400).json({
          message: "Invalid input. dealId, name, and titles are required.",
        });
      }

      // Validate mỗi title và items
      for (const title of dataForm.titles) {
        if (!title.title || !Array.isArray(title.items)) {
          return res.status(400).json({
            message:
              "Each title must have a valid title and an array of items.",
          });
        }

        for (const item of title.items) {
          if (typeof item !== "object") {
            return res.status(400).json({
              message: "Each item must be an object.",
            });
          }
        }
      }
      const updatedDeal = await Deal.findByIdAndUpdate(
        dealId, // ID của deal
        { name: dataForm.name, titles: dataForm.titles },
        { new: true }
      );

      if (!updatedDeal) {
        return res.status(404).json({ message: "Deal not found." });
      }
      res.status(200).json({
        message: "Deal updated successfully.",
        deal: updatedDeal,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDeal(req, res, next) {
    try {
      const { id } = req.params; // Lấy id từ URL
      const deal = await Deal.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );

      if (!deal) {
        return res.status(404).json({ msg: "Deal không tồn tại" });
      }

      res.status(200).json({ msg: "Xóa thành công", deal });
    } catch (e) {
      next(e); // Chuyển lỗi đến middleware xử lý lỗi
    }
  }
}
