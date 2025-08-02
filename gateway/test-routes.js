#!/usr/bin/env node

/**
 * Gateway Route Testing Script
 * 
 * Tests all configured routes to ensure proper port redirection
 */

import fetch from 'node-fetch';

const GATEWAY_URL = 'http://localhost:3000';
const TEST_ROUTES = [
  // FinClamp routes (should all go to port 5173)
  '/calculators?currency=dollar&in=emi',
  '/games?in=finance-quest',
  '/finclamp',
  '/finance',
  '/calculator',
  
  // Other app routes (will fail if apps not running, but should proxy correctly)
  '/arcade',
  '/engaged', 
  '/skips',
  
  // Health check
  '/health'
];

async function testRoute(route) {
  try {
    console.log(`Testing: ${route}`);
    const response = await fetch(`${GATEWAY_URL}${route}`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Gateway-Test-Script'
      }
    });
    
    const status = response.status;
    const contentType = response.headers.get('content-type') || '';
    
    if (status === 200) {
      console.log(`  ✅ ${status} - ${contentType.split(';')[0]}`);
    } else if (status === 502) {
      console.log(`  ⚠️  ${status} - Target service not running (proxy working)`);
    } else {
      console.log(`  ❌ ${status} - Unexpected status`);
    }
    
    return { route, status, success: status === 200 || status === 502 };
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return { route, status: 'ERROR', success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Gateway Routes\n');
  console.log(`Gateway URL: ${GATEWAY_URL}`);
  console.log(`Testing ${TEST_ROUTES.length} routes...\n`);
  
  const results = [];
  
  for (const route of TEST_ROUTES) {
    const result = await testRoute(route);
    results.push(result);
    console.log(''); // Empty line for readability
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('📊 Test Summary');
  console.log(`Successful: ${successful}/${total}`);
  
  if (successful === total) {
    console.log('🎉 All routes working correctly!');
  } else {
    console.log('⚠️  Some routes failed - check logs above');
    const failed = results.filter(r => !r.success);
    failed.forEach(f => {
      console.log(`   Failed: ${f.route} (${f.status})`);
    });
  }
}

// Run tests
runTests().catch(console.error);
