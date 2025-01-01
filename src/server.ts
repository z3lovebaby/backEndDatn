import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getEnvironmentVariables } from "./environments/environment";
import UserRouter from "./routers/UserRouter";
import ShopeeRouter from "./routers/ShopeeRouter";
import BannerRouter from "./routers/BannerRouter";
import QuanLyDonRouter from "./routers/QuanLyDonRouter";
import BankRouter from "./routers/BankRouter";
import * as cron from "node-cron";
import UserOrder from "./models/UserOrder";
import DealRouter from "./routers/DealRouter";
import ShopRouter from "./routers/ShopRouter";
export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
    this.setCronJobs();
  }
  setCronJobs() {
    // Lịch trình chạy vào 0h và 12h hàng ngày
    cron.schedule("0 0,12 * * *", async () => {
      await UserOrder.resetCounts(); // Giả sử bạn có phương thức resetCounts trong UserOrder
    });
  }
  setConfigs() {
    this.connectMongoDB();
    this.allowCors();
    this.configureBodyParser();
  }

  connectMongoDB() {
    mongoose.connect(getEnvironmentVariables().db_uri).then(() => {
      console.log("Connected to mongodb.");
    });
  }

  configureBodyParser() {
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    this.app.use(bodyParser.json());
  }

  allowCors() {
    this.app.use(cors());
  }

  setRoutes() {
    this.app.use("/src/uploads", express.static("src/uploads"));
    this.app.use("/api/user", UserRouter);
    this.app.use("/api/shopee", ShopeeRouter);
    this.app.use("/api/banner", BannerRouter);
    this.app.use("/api/quanlydon", QuanLyDonRouter);
    this.app.use("/api/bank", BankRouter);
    this.app.use("/api/deal", DealRouter);
    this.app.use("/api/shop", ShopRouter);
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Not found",
        status_code: 404,
      });
    });
  }

  handleErrors() {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message || "Something went wrong. Please try again!",
        status_code: errorStatus,
      });
    });
  }
}
