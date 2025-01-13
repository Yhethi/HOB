import mysql from "mysql2/promise";
import { dbConfig } from "../config/dbConfig.js";

export const createConnection = async () => {
  return await mysql.createConnection(dbConfig);
};
