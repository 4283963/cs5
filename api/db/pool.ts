import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let pool: mysql.Pool | null = null
let mockForced = false

export function isMockForced(): boolean {
  return mockForced || process.env.DB_USE_MOCK === 'true'
}

export function forceMock(): void {
  mockForced = true
}

export function getPool(): mysql.Pool | null {
  if (isMockForced()) return null
  if (!process.env.DB_HOST) return null
  if (pool) return pool
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cs5_auth',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    charset: 'utf8mb4',
  })
  return pool
}
