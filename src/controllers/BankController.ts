import Banner from "../models/Banner";
import * as fs from "fs";
import LenhRut from "../models/LenhRut";
import * as mongoose from "mongoose";
import User from "../models/User";
export class BankController {
  static async taoLenhRut(req, res, next) {
    const user = req.user; // User hiện tại đã đăng nhập
    console.log("filee:", user);
    try {
      // Kiểm tra dữ liệu nhập từ body
      const { name, stk, soTien, email, bank } = req.body;

      // Kiểm tra thông tin bắt buộc
      if (!name || !stk || !bank || !soTien || !email) {
        return res.status(400).json({ error: "Thông tin không đầy đủ" });
      }

      // Kiểm tra số tiền hợp lệ
      if (soTien <= 0 || soTien > user?.soDuKhaDung) {
        return res.status(400).json({ error: "Số tiền rút không hợp lệ" });
      }

      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email không hợp lệ" });
      }

      // Bắt đầu transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Tạo lệnh rút
        const mappedData = {
          name,
          stk,
          bank,
          money: soTien,
          email,
          user_id: user.aud,
        };

        const lenhRut = new LenhRut(mappedData);
        await lenhRut.save({ session });

        // Cập nhật số dư của user
        const updatedUser = await User.findByIdAndUpdate(
          user.aud, // Sử dụng `user._id` từ middleware
          {
            $inc: {
              soDu: -soTien,
              soDuKhaDung: -soTien,
            },
          },
          { new: true, session }
        );

        if (!updatedUser) {
          throw new Error("Không thể cập nhật số dư cho user");
        }

        // Hoàn tất transaction
        await session.commitTransaction();
        session.endSession();

        // Phản hồi thành công
        res.status(201).json({
          msg: "Tạo lệnh rút thành công",
          data: lenhRut,
        });
      } catch (err) {
        // Hủy transaction nếu xảy ra lỗi
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    } catch (e) {
      console.error("Lỗi khi tạo lệnh rút:", e);
      next(e); // Chuyển lỗi đến middleware xử lý lỗi
    }
  }
  static async updateLenhRut(req, res, next) {
    console.log("updateê lenh rut");
    try {
      // Lấy dữ liệu từ body
      const { id, num } = req.body;

      // Kiểm tra thông tin bắt buộc
      if (!id || num === undefined) {
        return res.status(400).json({ error: "Chưa đủ thông tin" });
      }

      // Xác định trạng thái và thông báo dựa trên num
      let newStatus;
      let newMsg;

      if (num == 0) {
        newStatus = "Đã hủy";
        newMsg = "Lệnh rút của bạn đã bị từ chối";
      } else if (num == 1) {
        newStatus = "Đã duyệt";
        newMsg = "Lệnh rút của bạn đã được phê duyệt và hoàn thành";
      } else {
        return res.status(400).json({ error: "Giá trị num không hợp lệ" });
      }
      const updatedRecord = await LenhRut.findByIdAndUpdate(
        id,
        {
          status: newStatus,
          msg: newMsg,
        },
        { new: true } // Trả về bản ghi đã cập nhật
      );
      if (!updatedRecord) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy bản ghi với ID này" });
      }
      res.status(200).json({
        message: "Xử lý yêu cầu thành công",
        data: updatedRecord,
      });
    } catch (e) {
      console.error("Lỗi khi cập nhật lệnh rút:", e);
      next(e);
    }
  }

  static async getAllContract(req, res, next) {
    try {
      const user = req.user; // Lấy thông tin user từ middleware
      let contracts;
      // Truy vấn tất cả các lệnh rút trùng với user_id
      if (user.type !== "admin") {
        contracts = await LenhRut.find({ user_id: user.aud }).sort({
          created_at: -1,
        }); // Sắp xếp theo thời gian mới nhất
      } else {
        contracts = await LenhRut.find().sort({
          created_at: -1,
        });
      }

      // Phản hồi danh sách lệnh rút
      res.status(200).json(contracts);
    } catch (e) {
      next(e); // Chuyển lỗi đến middleware xử lý lỗi
    }
  }
  static async getInfor(req, res, next) {
    try {
      let allLenhRut;
      let numLenhPD = 0;
      let contracts = await LenhRut.find();
      contracts.forEach((con) => {
        if (con.status === "Đang chờ xử lý") numLenhPD++;
      });
      allLenhRut = contracts.length;
      // Phản hồi danh sách lệnh rút
      res.status(200).json({
        all: allLenhRut,
        pd: numLenhPD,
      });
    } catch (e) {
      next(e); // Chuyển lỗi đến middleware xử lý lỗi
    }
  }
}
