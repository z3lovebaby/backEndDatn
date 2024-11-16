import { Utils } from "./../utils/Utils";
import axios from "axios";
export class ShopeeController {
  static async convertLink(req, res, next) {
    console.log(req.body);
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
        "accept-language": "vi,en-US;q=0.9,en;q=0.8",
        "af-ac-enc-dat": "c4ecb994f672875b",
        "af-ac-enc-sz-token": "",
        "affiliate-program-type": "1",
        "content-type": "application/json; charset=UTF-8",
        cookie:
          "SPC_F=1KAHZArs7bFaPzkTuLp4tnAI54WPFsZl; REC_T_ID=dd84fee4-2a66-11ef-bf08-5611ead14a03; SPC_CLIENTID=MUtBSFpBcnM3YkZhsqrenfupjmknvckp; SC_DFP=MeQjQDgcbAMKFUlxdYrYISUMFZWuUcWO; _QPWSDCXHZQA=f842bed0-788b-4603-c9e2-c02f3faec045; REC7iLP4Q=c4cd120a-70e3-432e-8f1d-8d896df89e70; SPC_SI=SVk0ZwAAAABkbHhhMzFVd9hYAAAAAAAAVkFReFNrREQ=; link_social_media_1291562930=1; SPC_EC=.SnVCamZZWVVxVmpQSjJCaQf7eCM3NCXbS6jAOvA9wc+gqJYkPlJe6pW4rDGLbLCyJN9htX9eipNJVIRL50B11C06uNKEZ87Zoi302PpPfde62vkepCZ8XXk6rzedJPIbjGVQGOaNwe0ZguKInjQJ1GTs1uijQ1XiXVzmqSHwb/Qq/T5q2vuPodvhrmr0P8DWh4xR7FNVOWY1juyebmaITyalNdpr6e3lfDBJYSoULxCpQkmpsUHLKdGV4tQ2xWlD; SPC_ST=.SnVCamZZWVVxVmpQSjJCaQf7eCM3NCXbS6jAOvA9wc+gqJYkPlJe6pW4rDGLbLCyJN9htX9eipNJVIRL50B11C06uNKEZ87Zoi302PpPfde62vkepCZ8XXk6rzedJPIbjGVQGOaNwe0ZguKInjQJ1GTs1uijQ1XiXVzmqSHwb/Qq/T5q2vuPodvhrmr0P8DWh4xR7FNVOWY1juyebmaITyalNdpr6e3lfDBJYSoULxCpQkmpsUHLKdGV4tQ2xWlD; language=vi; _sapid=eeb34c24ebb18b42fb9560177a2361258b9404254323eef3e10d65a1; SPC_U=1136117626; SPC_R_T_ID=TYcpB89ZMNN4VeZ9cuLgHYr81Uoa2OqbdKGh9brFnHcNgWEh7Az451mOUA6aTB4TksmmdKFVANsUtUPRAhsB9U8xh7F3cAc9ZxesQ5kaPl2AldUN73a0xJZ7KsWFPeyA3YdUxythi2Yq6AOSWNKhlhlJN4ONDZafAMW19B3OWRY=; SPC_R_T_IV=WGN2QmNiMWlrWDZzOFFHZg==; SPC_T_ID=TYcpB89ZMNN4VeZ9cuLgHYr81Uoa2OqbdKGh9brFnHcNgWEh7Az451mOUA6aTB4TksmmdKFVANsUtUPRAhsB9U8xh7F3cAc9ZxesQ5kaPl2AldUN73a0xJZ7KsWFPeyA3YdUxythi2Yq6AOSWNKhlhlJN4ONDZafAMW19B3OWRY=; SPC_T_IV=WGN2QmNiMWlrWDZzOFFHZg==; SPC_CDS_CHAT=c8ef1dfb-d656-4470-afb7-56b4a6fc7366; SPC_EC=.ekVEMkpaSk9xZEdsY0I5R59/cWfsCr+qY4sCJRA8Tpbm4HQ43Jn/3G6GhwrloePQRnFEWG0YjjOOfAiGcVfDY9MDbSf2TiZcbvFOJw+FIc0z6aTBbGTkhcGMSKtlwvL+4v4F9Ti3iOP3g9Bdlt1l1Hp/PYh8JKqmkowk3grRIeI7eVYEzLxzgj3Nbt0YuYuxyyDXYnoDzc8sUlCnr45jHUg3WL7M5xpSnOSLgPDaiOwPce1CCyHBo4Oo7QGNxiQ+; SPC_R_T_ID=g7cQ87kNcGU1WPCN/Hdmbp6qM/LQNnRxrtnhU6Wp3lvjP9iKLeknSSBj4VsLING/lBPO4mMREUTZEOEufuj634LiiPzvmF+JARODD2A6cJPcFM1jWNz7GYv4q3T8TckorwdUaDx4v2UWR8WCq02VHnIvcyXpTLwvKOXk76WOekI=; SPC_R_T_IV=T1ZPOWtOTDkzMWcxZ3lWTg==; SPC_SI=wcI1ZwAAAABLMkNLR1lhOX2WBgAAAAAATnRJek9uYms=; SPC_ST=.ekVEMkpaSk9xZEdsY0I5R59/cWfsCr+qY4sCJRA8Tpbm4HQ43Jn/3G6GhwrloePQRnFEWG0YjjOOfAiGcVfDY9MDbSf2TiZcbvFOJw+FIc0z6aTBbGTkhcGMSKtlwvL+4v4F9Ti3iOP3g9Bdlt1l1Hp/PYh8JKqmkowk3grRIeI7eVYEzLxzgj3Nbt0YuYuxyyDXYnoDzc8sUlCnr45jHUg3WL7M5xpSnOSLgPDaiOwPce1CCyHBo4Oo7QGNxiQ+; SPC_T_ID=g7cQ87kNcGU1WPCN/Hdmbp6qM/LQNnRxrtnhU6Wp3lvjP9iKLeknSSBj4VsLING/lBPO4mMREUTZEOEufuj634LiiPzvmF+JARODD2A6cJPcFM1jWNz7GYv4q3T8TckorwdUaDx4v2UWR8WCq02VHnIvcyXpTLwvKOXk76WOekI=; SPC_T_IV=T1ZPOWtOTDkzMWcxZ3lWTg==; SPC_U=1225507854",
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
}
