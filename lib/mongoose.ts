import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
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
    return cached.conn
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'devstack',
      })
      .then(result => {
        console.log('Connected to mongodb')
        return result
      })
      .catch(err => {
        console.error('Error connecting to mongodb')
        throw err
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
