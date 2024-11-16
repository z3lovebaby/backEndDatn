import { Environment } from "./environment";

export const DevEnvironment: Environment = {
  db_uri: "mongodb://localhost:27017/",
  jwt_secret_key: "secretkey",
  jwt_refresh_secret_key: "rfscrerejwt_refresh_secret_key",
  sendgrid: {
    api_key: "your_sendgrid_api_key",
    email_from: "phu24012002@gmail.com",
  },
  gmail_auth: {
    user: "phunh205165@gmail.com",
    pass: "baxn zodi ewxc cuhm",
  },
};
