import { Utils } from "./../utils/Utils";
import * as dotenv from "dotenv"; // Import toàn bộ module
dotenv.config();
import axios from "axios";
import Cookie from "../models/Cookie";
export class ShopeeController {
  static async convertLink(req, res, next) {
    // Tìm bản ghi đầu tiên trong bảng cookies
    const getCookie = await Cookie.findOne();

    if (!getCookie) {
      res.status(404).json({
        message: "No cookie found.",
      });
    }
    console.log("cook", getCookie.cookie);
    let data = {
      operationName: "batchGetCustomLink",
      query: `
    query batchGetCustomLink($linkParams: [CustomLinkParam!], $sourceCaller: SourceCaller) {
      batchCustomLink(linkParams: $linkParams, sourceCaller: $sourceCaller) {
        shortLink
        longLink
        failCode
      }
    }
  `,
      variables: {
        linkParams: [
          {
            originalLink: req.body.link,
            advancedLinkParams: {},
          },
        ],
        sourceCaller: "CUSTOM_LINK_CALLER",
      },
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://affiliate.shopee.vn/api/v3/gql",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,vi;q=0.8",
        "af-ac-enc-sz-token": "",
        "affiliate-program-type": "1",
        "content-type": "application/json; charset=UTF-8",
        cookie: getCookie.cookie,
        origin: "https://affiliate.shopee.vn",
        priority: "u=1, i",
        referer: "https://affiliate.shopee.vn/offer/custom_link",
        "sec-ch-ua":
          '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
        "x-sap-ri": "6edb55676bc9ae1af9f8223a03014bdfeed0b953d92af070546c",
        "x-sap-sec":
          "RYNpt6JAMaFX+aFXN7Fu+amXN7FX+amX+aFA+aFX8atX+ycW+aDz+SFXNaFX+Yd6UPLu+aFX6atX+xcW+aF9cX/ZqXtaeiTjctQjnKnTS6bgekkx3aizkMbMOj0EYErkTKR23Ppwz8k9mDQGzRELfuWHg0cjXU2g3XdtryIyow9FO5mJlxZLibShiFiLeXykFp4A2MQP+4yJU4nYlJFTNuftrN5RkMJbdUyEqqi9sHsZ89yJ2klNQeCs++Y1G00Ij9xXE45yeSsmg38HJtQZkzm8QoYWZUft8xTTeGFty1R9L2keBbg9A2CjTKNe4YlIVe9fA1NH3oXWyJJeSKclQg1xPojXhst9qYddWo8eGCKkdF7u2LSbs+rVX6zL5NLwxzP5eysG9iFRBqEBD+Yc6YMo+cqi3CB6I7r30xBFzfemSctkiVDysSxk2Smr3ptXfpAFhq+8qcmBeRgyOv1zWrArapoYCTMK7YFgOMvF2+U0H9oPvDCzGoku4tfTVwJ453hNJvmlA70lBeKZhTuMjxOaDk7dE5VhOqS2siyNkakP+f8kqBpIPtvgNVrU83UujftZZQ7m/g0KLIn6RMDWaNdT68PQdfxRj0WibtC4YJR2XBSM631m+9ijef+YibA634uctG5n9z7aT7v7XLTZGFQB2YzG96mmQgnn0SQhxIVwc4fBm6jRyihWAcLnKPUXgU0Y806Pv2kx9w3FTHvSaNrexLvFY94d30K5gbnmrER5TI9/9bN6XmKYp/tqzK2nvP9JIRfhr40xBrVp6jtbhmYkf69amFiWVePPMuMf3Je5JLl3afBM+TWr+STOdN0T9FVWvgmlEHh2hgOiXaJOm77z8AHTtn816pwFcr3uS1GMkBM0STpTHO74i2RLQBkn4LkQNRqzHLtoJJa84/+TYbzzDu4OQPXabuJeoYUA5IICPwXu+R988A0k9ECU0Pv49DJCArBNQRIQ53XP1k60AH/rWbVkkCRbQD1+FZB6gPIi/HAofX4nUEnaCjYEaiW0k96Mqh9eKMDbTrndhOkOh9jefNXn9UrELwefh0Mnb6RwV+1G4Nv2dxpWpGvepXYipSNWYx+hgLD2HS6AfVNfrt/iqCAMhtSkP+g3BaCgloe0yC05TmrJnO2ph4RJyJ3N8xMPwPk6oF/dZaJX+aF0osUMpC8c/1FX+aAwUP0/BaFX+bcX+aFz+aFXgUsa1wRRISy4h8gkxHE8gvYqQ0Uu+aFX6CWP/ZZMoKZX+aFX8g0/USJX+aFb+aFXRaFX+GzS8fQRtO3KqMbQYD09BrDucVs6BaFX+Zxk/ZOOo3FN+aFX+aJXMaFu+amXBaFX+aJX+aFb+aFXRaFX+GdN9hDk/A8zWGh/0yVni5QLPtVwBaFX+ZtQ7CmN7snO+aFX+C==",
        "x-sz-sdk-version": "1.10.15",
      },
      data: data,
    };
    try {
      const respone = await axios.request(config);
      if (respone.status == 200) {
        console.log(respone.data);
        res.json(respone.data);
      } else {
        throw new Error("External API call failed");
      }
    } catch (e) {
      next(e);
    }
  }
  static async getPriceHistory(req, res, next) {
    console.log(req.body);
    const link = req.body.link;
    if (!link) {
      return res.status(400).json({ error: "Link is required" });
    }
    try {
      // Gửi request đến short link
      const response = await axios.get(link, {
        maxRedirects: 0, // Không tự động follow redirect
        validateStatus: (status) => status >= 200 && status < 400, // Chỉ chấp nhận trạng thái HTTP < 400
      });

      const fullLink = response.headers.location; // Lấy URL từ header location
      if (fullLink) {
        let apiGetID = process.env.API_GET_ID;
        const response2 = await axios.get(apiGetID, {
          params: {
            product_url: fullLink,
          },
        });
        console.log(response2.data.data.product_base?.product_base_id);
        let prod_id = response2?.data?.data?.product_base?.product_base_id;
        let dataFE = {
          img: response2?.data?.data?.product_base?.url_thumbnail,
          title: response2?.data?.data?.product_base?.name,
          gia: response2?.data?.data?.product_base?.price,
          price_insight: response2?.data?.data?.product_base?.price_insight,
          rate: response2?.data?.data?.product_base?.rating_avg,
          rate_count: response2?.data?.data?.product_base?.rating_count,
          sold: response2?.data?.data?.product_base?.historical_sold,
        };
        if (prod_id) {
          let apiGetPrice = process.env.API_GET_PRICE;
          const response3 = await axios.get(apiGetPrice, {
            params: {
              product_base_id: prod_id,
            },
          });
          res.json({
            dataFE,
            his: response3.data.data.product_history_data.item_history,
          });
        } else {
          return res
            .status(404)
            .json({ error: "Có lỗi xảy ra tại máy chủ, thử lại sau" });
        }
      } else {
        return res.status(404).json({ error: "Could not resolve full link" });
      }
    } catch (error) {
      console.error("Error resolving link:", error);
      return res.status(500).json({ error: "Failed to resolve short link" });
    }
  }
  static async saveCookie(req, res, next) {
    console.log(req.body.link);
    try {
      const cookie = req.body.link;

      if (cookie) {
        // Tìm bản ghi đầu tiên trong bảng
        let existingCookie = await Cookie.findOne();

        if (existingCookie) {
          // Cập nhật giá trị cookie nếu đã tồn tại
          existingCookie.cookie = cookie;
          await existingCookie.save();
          res.status(200).json({
            message: "Cookie updated successfully!",
          });
        } else {
          // Tạo mới bản ghi cookie nếu chưa tồn tại
          const newCookie = await Cookie.create({ cookie });
          res.status(201).json({ message: "Cookie saved successfully!" });
        }
      } else {
        res.status(400).json({ message: "Cookie value is required." });
      }
    } catch (e) {
      next(e);
    }
  }
  static async getAllVoucher(req, res, next) {
    try {
      // Giá trị mặc định
      const sort = "totalClick,DESC";
      const slugSupplier = "shopee";
      const page = req.query.page;
      console.log("test", req.query);
      // Kết hợp giá trị từ body và giá trị mặc định

      // Xây dựng URL API
      const baseUrl = "https://portal.piggi.vn/api/voucher";
      const queryParams = new URLSearchParams({ sort, slugSupplier, page });
      const apiUrl = `${baseUrl}?${queryParams.toString()}`;

      // Cấu hình axios
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: apiUrl,
        headers: {
          accept: "*/*",
          "content-type": "application/json; charset=utf-8",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
      };

      // Gửi yêu cầu API
      const response = await axios.request(config);
      const vouchers = response.data;

      // Kiểm tra và trả kết quả
      if (!vouchers || vouchers.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy voucher nào." });
      }

      res.status(200).json(vouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error.message);
      next(error);
    }
  }
}
