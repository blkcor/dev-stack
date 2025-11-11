#!/usr/bin/env node

/**
 * MongoDB Connection Diagnostic Script
 * This script helps diagnose MongoDB Atlas connectivity issues,
 * especially useful in restricted networks (e.g., China mainland with VPN)
 */

const dns = require('dns').promises

const mongoose = require('mongoose')


// Load environment variables
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables')
  process.exit(1)
}

// Extract cluster hostname
const clusterMatch = MONGODB_URI.match(/@([^/]+)\//)
const clusterHost = clusterMatch ? clusterMatch[1] : null

async function testDNSResolution() {
  console.log('\n🔍 Step 1: Testing DNS Resolution')
  console.log('=====================================')

  if (!clusterHost) {
    console.log('❌ Could not extract cluster hostname from MongoDB URI')
    return false
  }

  console.log(`Cluster hostname: ${clusterHost}`)

  try {
    const addresses = await dns.resolve(clusterHost)
    console.log('✅ DNS resolution successful')
    console.log(`   Found ${addresses.length} IP addresses:`)
    addresses.forEach((addr, i) => {
      console.log(`   ${i + 1}. ${addr}`)
    })
    return true
  } catch (err) {
    console.error('❌ DNS resolution failed:', err.message)
    console.log('\n💡 Possible solutions:')
    console.log('   - Check your VPN connection')
    console.log('   - Try using a different DNS server (e.g., 8.8.8.8, 1.1.1.1)')
    console.log('   - Verify network connectivity')
    return false
  }
}

async function testMongoDBConnection() {
  console.log('\n🔍 Step 2: Testing MongoDB Connection')
  console.log('=====================================')

  const startTime = Date.now()

  try {
    console.log('Attempting to connect to MongoDB Atlas...')
    console.log('(This may take up to 60 seconds)')

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 75000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
      family: 4,
      directConnection: false,
    })

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`✅ Successfully connected to MongoDB in ${duration}s`)

    // Test a simple operation
    const adminDb = mongoose.connection.db.admin()
    const result = await adminDb.ping()
    console.log('✅ Database ping successful:', result)

    await mongoose.disconnect()
    console.log('✅ Disconnected successfully')

    return true
  } catch (err) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error(`❌ Connection failed after ${duration}s`)
    console.error('Error:', err.message)
    console.error('Error name:', err.name)

    console.log('\n💡 Possible solutions:')
    console.log('   1. Verify IP whitelist in MongoDB Atlas includes 0.0.0.0/0')
    console.log('   2. Check if your VPN is stable and working')
    console.log('   3. Try connecting from a different network')
    console.log('   4. Consider using MongoDB Atlas China region (if available)')
    console.log('   5. Use a local MongoDB instance for development')
    console.log('   6. Try a different MongoDB Atlas cluster region (preferably Singapore or Tokyo)')

    return false
  }
}

async function runDiagnostics() {
  console.log('🚀 MongoDB Connection Diagnostics')
  console.log('===================================')
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`MongoDB URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`)

  const dnsOk = await testDNSResolution()

  if (!dnsOk) {
    console.log('\n❌ DNS resolution failed. Skipping connection test.')
    console.log('Please fix DNS issues before testing MongoDB connection.')
    process.exit(1)
  }

  const connectionOk = await testMongoDBConnection()

  console.log('\n📊 Diagnostic Summary')
  console.log('=====================')
  console.log(`DNS Resolution: ${dnsOk ? '✅ OK' : '❌ Failed'}`)
  console.log(`MongoDB Connection: ${connectionOk ? '✅ OK' : '❌ Failed'}`)

  process.exit(connectionOk ? 0 : 1)
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err)
  process.exit(1)
})

// Run diagnostics
runDiagnostics()
