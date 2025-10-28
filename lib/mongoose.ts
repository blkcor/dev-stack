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
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'devstack',
      })
      .then(result => {
        logger.info('Connect to mongodb')
        return result
      })
      .catch(err => {
        logger.error('Error connecting to mongodb')
        throw err
      })
  }

  logger.info('Create a new mongoose connection')
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
