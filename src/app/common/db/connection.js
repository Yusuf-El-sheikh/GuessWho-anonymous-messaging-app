import { config } from "dotenv";
config();

import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);