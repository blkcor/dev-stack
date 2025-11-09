import mongoose, { Mongoose } from 'mongoose'

import { logger } from '@/lib/logger'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  logger.error(`MongoDB URI doesn't exist`)
  throw new Error('❌ Missing environment variable: MONGODB_URI')
}

interface MongooseCache {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  }
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info('Using existing mongoose connection')
    return cached.conn
  }
  if (!cached.promise) {
    // Extract cluster hostname for diagnostics
    const clusterMatch = MONGODB_URI.match(/@([^/]+)\//)
    const clusterHost = clusterMatch ? clusterMatch[1] : 'unknown'
    logger.info(`Attempting to connect to MongoDB cluster: ${clusterHost}`)

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'devstack',
        serverSelectionTimeoutMS: 60000, // Increased to 60 seconds
        socketTimeoutMS: 75000, // 75 seconds socket timeout
        connectTimeoutMS: 60000, // 60 seconds connection timeout
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        retryReads: true,
        // Additional options for better connectivity in restricted networks
        family: 4, // Force IPv4 (IPv6 can cause issues in some networks)
        directConnection: false, // Use SRV connection for better reliability
      })
      .then(result => {
        logger.info('✅ Successfully connected to MongoDB')
        return result
      })
      .catch(err => {
        logger.error(`❌ Failed to connect to MongoDB cluster: ${clusterHost}`)
        logger.error('Connection error details:', {
          message: err.message,
          name: err.name,
          code: err.code,
        })
        throw err
      })
  }

  logger.info('Creating new mongoose connection...')
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
