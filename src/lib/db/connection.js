import mongoose from "mongoose";
import {env} from "../config/env.js"

mongoose.connect(env.db.url);
