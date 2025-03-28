import dotenv from "dotenv";
dotenv.config();

export default {
  ACCESS_TOKEN: process.env.ACCESS_TOKEN || '',
  PORT: process.env.PORT || 3030,
  HOST: process.env.HOST || 'localhost',
  USER: process.env.USER || 'root',
  PASSWORD: process.env.PASSWORD || '',
  DB: process.env.DB || '',

  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
  AWS_REGION: process.env.AWS_REGION || '',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
}
