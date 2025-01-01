import Banner from "../models/Banner";
import * as fs from "fs";
import * as csv from "csv-parser";
import OrderShopee from "../models/OrderShopee";
import UserOrder from "../models/UserOrder";
import { body } from "express-validator";
export class QuanLyDonController {
  static async addOrderByFile(req, res, next) {
    try {
      const filePath = req.file?.path;

      if (!filePath) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const results: any[] = [];
      const existingOrders = new Map();

      // Đọc file CSV
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
          // Chuẩn hóa tên cột
          const formattedData = Object.keys(data).reduce((acc, key) => {
            const formattedKey = key
              .trim()
              .replace(/\s+/g, "_")
              .replace(/[^a-zA-Z0-9_]/g, "");
            acc[formattedKey] = data[key];
            return acc;
          }, {} as Record<string, any>);

          // Tạo object dữ liệu
          const filteredData = {
            orderId: formattedData["ID_n_hng"],
            status: formattedData["Trng_thi_t_hng"],
            checkoutId: formattedData["Checkout_id"],
            time: formattedData["Thi_Gian_t_Hng"],
            itemId: formattedData["Item_id"],
            productName: formattedData["Tn_Item"],
            commission: formattedData["Tng_hoa_hng_n_hng"],
          };

          results.push(filteredData);
        })
        .on("end", async () => {
          try {
            // Lấy tất cả các cặp orderId và itemId trong file CSV
            const orderIdItemIdPairs = results.map((item) => ({
              orderId: item.orderId,
              itemId: item.itemId,
            }));

            // Tìm các đơn hàng đã tồn tại trong MongoDB
            const existingOrdersData = await OrderShopee.find({
              $or: orderIdItemIdPairs.map(({ orderId, itemId }) => ({
                orderId,
                itemId,
              })),
            });

            // Đưa dữ liệu đã tồn tại vào Map
            existingOrdersData.forEach((order) =>
              existingOrders.set(`${order.orderId}_${order.itemId}`, order)
            );

            const bulkOperations = results.map((order) => {
              const key = `${order.orderId}_${order.itemId}`;
              if (existingOrders.has(key)) {
                // Cập nhật nếu đã tồn tại
                return {
                  updateOne: {
                    filter: { orderId: order.orderId, itemId: order.itemId },
                    update: { $set: order },
                  },
                };
              } else {
                // Thêm mới nếu không tồn tại
                return { insertOne: { document: order } };
              }
            });

            // Sử dụng bulkWrite để thực hiện cập nhật hoặc thêm mới
            await OrderShopee.bulkWrite(bulkOperations);

            res
              .status(200)
              .json({ message: "Data saved/updated successfully!" });
          } catch (err) {
            console.error("Error saving data to MongoDB:", err);
            res.status(500).json({ error: "Error saving data" });
          } finally {
            fs.unlinkSync(filePath); // Xóa file sau khi xử lý
          }
        });
    } catch (err) {
      console.error("Error processing file:", err);
      res.status(500).json({ error: "Error processing file" });
    }
  }

  static async getOrderItems(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Truy vấn có phân trang
      const orderItems = await OrderShopee.find()
        .lean()
        .skip(skip)
        .limit(Number(limit));
      const total = await OrderShopee.countDocuments();
      const totalPage = Math.ceil(total / limit);
      res.status(200).json({
        total,
        totalPage: totalPage,
        page: Number(page),
        limit: Number(limit),
        data: orderItems,
      });
    } catch (error) {
      console.error("Error fetching paginated orders:", error);
      next(error);
    }
  }
  static async userAddOrder(req, res, next) {
    console.log("aaaa", req.body, req.user);
    try {
      const user = req.user;
      let orderId = req.body.orderID;

      // Kiểm tra orderId có được cung cấp không
      if (!orderId) {
        return res.status(400).json({ message: "Thiếu thông tin orderId" });
      }

      // Kiểm tra UserOrder đã tồn tại chưa
      let userOrder = await UserOrder.findOne({ user_id: user.aud });

      // Nếu không tồn tại, tạo mới UserOrder
      if (!userOrder) {
        userOrder = new UserOrder({
          name: user.email,
          user_id: user.aud,
        });
      }

      // Kiểm tra nếu count >= 5
      if (userOrder.count >= 5) {
        return res.status(403).json({
          message: "Bạn đã nhập sai quá 5 lần. Vui lòng chờ 12 giờ để thử lại.",
        });
      }

      // Tìm tất cả các đơn hàng khớp trong OrderShopee
      const orders = await OrderShopee.find({ orderId, user_id: null });

      if (orders.length === 0) {
        // Không có đơn hàng nào khớp
        userOrder.count += 1;
        await userOrder.save();

        return res.status(404).json({
          message:
            "Order không tồn tại hoặc đã được sử dụng. Nhập sai quá 5 lần có thể bị khóa.",
          remainingAttempts: 5 - userOrder.count,
        });
      }

      // Cập nhật user_id cho tất cả các đơn hàng tìm thấy
      await OrderShopee.updateMany(
        { orderId, user_id: null },
        { $set: { user_id: user.aud } }
      );

      // Giả sử orders là mảng các đơn hàng, và bạn muốn thêm tất cả orderId vào userOrder.orders
      orders.forEach((order) => {
        const orderToAdd = order._id; // Lấy _id của từng đơn hàng

        // Kiểm tra nếu orderId chưa có trong danh sách orders, thì thêm vào
        if (!userOrder.orders.includes(orderToAdd)) {
          userOrder.orders.push(orderToAdd);
        }
      });

      // Lưu lại thông tin UserOrder
      await userOrder.save();

      res.status(200).json({
        message: "Thêm order thành công",
        data: userOrder,
      });
    } catch (error) {
      console.error("Lỗi khi thêm order:", error);
      next(error);
    }
  }
  static async getUserOrder(req, res, next) {
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
      // Trả về kết quả
      return res.status(200).json({
        message: "Lấy thông tin đơn hàng thành công.",
        data: {
          userOrder: {
            name: userOrder.name,
            orders,
          },
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      next(error);
    }
  }
}
