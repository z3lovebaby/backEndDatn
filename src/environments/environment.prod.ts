import { Environment } from "./environment";

export const ProdEnvironment: Environment = {
  db_uri: "your_uri_string",
  jwt_secret_key: "secretkeyprod",
  jwt_refresh_secret_key: "rfscrerejwt_refresh_secret_key",
  sendgrid: {
    api_key: "your_sendgrid_api_key",
    email_from: "sender_email",
  },
  gmail_auth: {
    user: "your_gmail_email_id",
    pass: "your_gmail_password",
  },
};
