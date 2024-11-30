import { Environment } from "./environment";

export const DevEnvironment: Environment = {
  db_uri:
    "mongodb+srv://phunh20205165:2awkIh7VEqqfGHOk@cluster0.ovf6j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  jwt_secret_key: "secretkey",
  jwt_refresh_secret_key: "rfscrerejwt_refresh_secret_key",
  sendgrid: {
    api_key: "your_sendgrid_api_key",
    email_from: "phu24012002@gmail.com",
  },
  gmail_auth: {
    user: "phunh20205165@gmail.com",
    pass: "ztob oans geij skst",
  },
};
