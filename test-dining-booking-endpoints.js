#!/usr/bin/env node

/**
 * Validation script to verify dining booking endpoints
 * Tests that all screens use the centralized API_ENDPOINTS config
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Dining Booking Endpoints Configuration\n');

// 1. Verify config/api.js has all required endpoints
console.log('1️⃣  Checking config/api.js for DiningBooking endpoints...\n');
const apiConfigPath = path.join(__dirname, 'config', 'api.js');
const apiConfigContent = fs.readFileSync(apiConfigPath, 'utf8');

const requiredEndpoints = [
  'GET_ALL',
  'GET_BY_ID',
  'CREATE',
  'UPDATE',
  'CANCEL',
  'GET_USER',
  'GET_BY_USERID',
  'UPDATE_STATUS'
];

const diningBookingSection = apiConfigContent.match(/DiningBooking:\s*\{([\s\S]*?)\n\s*\}/);
if (!diningBookingSection) {
  console.log('❌ DiningBooking endpoint config not found!');
  process.exit(1);
}

let missingEndpoints = [];
requiredEndpoints.forEach(endpoint => {
  if (!diningBookingSection[1].includes(endpoint)) {
    missingEndpoints.push(endpoint);
  }
});

if (missingEndpoints.length === 0) {
  console.log('✅ All required endpoints defined in config/api.js:');
  requiredEndpoints.forEach(ep => console.log(`   - ${ep}`));
} else {
  console.log(`❌ Missing endpoints: ${missingEndpoints.join(', ')}`);
  process.exit(1);
}

// 2. Verify screens import and use API_ENDPOINTS
console.log('\n2️⃣  Checking screens import and use API_ENDPOINTS...\n');

const screensToCheck = [
  {
    path: 'app/screens/DiningBooking.jsx',
    requiredImport: "import { API_ENDPOINTS }",
    requiredUsage: "API_ENDPOINTS.DiningBooking"
  },
  {
    path: 'app/screens/DiningBookingDetails.jsx',
    requiredImport: "import { API_ENDPOINTS }",
    requiredUsage: "API_ENDPOINTS.DiningBooking.CANCEL"
  },
  {
    path: 'app/screens/FirmBookingSummary.jsx',
    requiredImport: "import { API_ENDPOINTS }",
    requiredUsage: "API_ENDPOINTS.DiningBooking.CREATE"
  },
  {
    path: 'Model/Notifications.jsx',
    requiredImport: "import { API_ENDPOINTS }",
    requiredUsage: "API_ENDPOINTS.DiningBooking.GET_BY_USERID"
  }
];

let allScreensValid = true;

screensToCheck.forEach(screen => {
  const screenPath = path.join(__dirname, screen.path);
  try {
    const content = fs.readFileSync(screenPath, 'utf8');
    
    const hasImport = content.includes(screen.requiredImport);
    const hasUsage = content.includes(screen.requiredUsage);
    
    if (hasImport && hasUsage) {
      console.log(`✅ ${screen.path}`);
      console.log(`   - Import found: ${screen.requiredImport.substring(0, 40)}...`);
      console.log(`   - Usage found: ${screen.requiredUsage}`);
    } else {
      console.log(`❌ ${screen.path}`);
      if (!hasImport) console.log(`   - Missing import: ${screen.requiredImport}`);
      if (!hasUsage) console.log(`   - Missing usage: ${screen.requiredUsage}`);
      allScreensValid = false;
    }
  } catch (err) {
    console.log(`❌ ${screen.path} - File not found`);
    allScreensValid = false;
  }
});

// 3. Check for remaining hardcoded endpoint paths in screens
console.log('\n3️⃣  Scanning for remaining hardcoded endpoint paths...\n');

const diningScreenFiles = [
  'app/screens/DiningBooking.jsx',
  'app/screens/DiningBookingDetails.jsx',
  'app/screens/FirmBookingSummary.jsx',
  'Model/Notifications.jsx'
];

let foundHardcoded = false;
const hardcodedPatterns = [
  { pattern: '/api/bookings', safe: ['GET_ALL', 'GET_BY_ID', 'CREATE', 'UPDATE', 'CANCEL', 'GET_USER', 'GET_BY_USERID', 'UPDATE_STATUS', 'API_ENDPOINTS'] },
  { pattern: '/api/UserBookings', safe: ['GET_USER', 'API_ENDPOINTS'] },
  { pattern: '/api/bookings/create', safe: ['CREATE', 'API_ENDPOINTS'] },
  { pattern: '/api/bookings/cancel', safe: ['CANCEL', 'API_ENDPOINTS'] },
  { pattern: '/api/bookings/userId', safe: ['GET_BY_USERID', 'API_ENDPOINTS'] }
];

diningScreenFiles.forEach(screenFile => {
  const screenPath = path.join(__dirname, screenFile);
  try {
    const content = fs.readFileSync(screenPath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      // Skip comments and config lines
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
      if (line.includes('config/api.js')) return; // This is a comment
      
      hardcodedPatterns.forEach(({ pattern, safe }) => {
        // Check if line contains the pattern as a string literal (not in config)
        const stringLiteralRegex = new RegExp(`['"]\`?${pattern.replace(/\//g, '\\/')}`, 'i');
        if (stringLiteralRegex.test(line) && !safe.some(s => line.includes(s))) {
          console.log(`⚠️  Found hardcoded API path in ${screenFile}:${idx + 1}`);
          console.log(`    ${line.trim().substring(0, 80)}`);
          foundHardcoded = true;
        }
      });
    });
  } catch (err) {
    // File not found, skip
  }
});

if (!foundHardcoded) {
  console.log('✅ No hardcoded endpoint paths found in screens (all using API_ENDPOINTS)');
}

// 4. Summary
console.log('\n' + '='.repeat(60));
console.log('📋 VALIDATION SUMMARY\n');

if (allScreensValid && !foundHardcoded) {
  console.log('✅ All dining booking endpoints are properly configured!');
  console.log('\n✨ What was updated:');
  console.log('   1. config/api.js - Added centralized DiningBooking endpoints');
  console.log('   2. DiningBooking.jsx - Uses API_ENDPOINTS.DiningBooking.GET_USER');
  console.log('   3. DiningBookingDetails.jsx - Uses API_ENDPOINTS.DiningBooking.CANCEL(id)');
  console.log('   4. FirmBookingSummary.jsx - Uses API_ENDPOINTS.DiningBooking.CREATE');
  console.log('   5. Model/Notifications.jsx - Uses API_ENDPOINTS.DiningBooking.GET_BY_USERID');
  console.log('\n✨ Endpoints available:');
  console.log('   - GET_ALL: /api/bookings (fetch all bookings)');
  console.log('   - GET_BY_ID: /api/bookings/:id (fetch single booking)');
  console.log('   - CREATE: /api/bookings/create (create new booking)');
  console.log('   - UPDATE: /api/bookings/:id (update booking)');
  console.log('   - CANCEL: /api/bookings/cancel/:id (cancel booking)');
  console.log('   - GET_USER: /api/UserBookings (fetch user bookings, authenticated)');
  console.log('   - GET_BY_USERID: /api/bookings/userId (legacy user endpoint)');
  console.log('   - UPDATE_STATUS: /api/bookings/:id/status (update booking status)');
  console.log('\n🚀 Ready for integration testing!');
  process.exit(0);
} else {
  console.log('❌ Validation failed. Please review the issues above.');
  process.exit(1);
}
