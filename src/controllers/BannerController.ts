import Banner from "../models/Banner";
import * as fs from "fs";
export class BannerController {
  static async addBanner(req, res, next) {
    console.log("filee:", req.body.link);
    const path = req.file.path;
    try {
      const data = {
        banner: path,
        link: req.body.link,
      };
      const banner = await new Banner(data).save();
      res.send(banner);
    } catch (e) {
      next(e);
    }
  }

  static async getBanners(req, res, next) {
    const bannerData = [];
    try {
      const banners = await Banner.find({ status: true });
      for (const banner of banners) {
        //console.log("banner", banner);
        let data = await fs.promises.readFile(banner.banner);
        //console.log("dataaa:", data);
        bannerData.push({
          dataFile: data.toString("base64"),
          banner,
        });
      }
      console.log(bannerData);
      res.send(bannerData);
    } catch (e) {
      next(e);
    }
  }
}
