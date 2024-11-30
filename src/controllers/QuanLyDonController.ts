import Banner from "../models/Banner";
import * as fs from "fs";
import * as csv from "csv-parser";
import OrderShopee from "../models/OrderShopee";
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
}
