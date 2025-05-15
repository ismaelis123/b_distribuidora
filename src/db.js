import { createPool } from "mysql2/promise";
import {DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE} from './config.js';
import {DB_HOST2, DB_PORT2, DB_USER2, DB_PASSWORD2, DB_DATABASE2} from './config.js';

export const pool2 = createPool({
  host: DB_HOST2,
  user: DB_USER2,
  password: DB_PASSWORD2,
  port: DB_PORT2,
  database: DB_DATABASE2
});






export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE
});