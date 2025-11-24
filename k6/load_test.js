import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics for database performance tuning
const errorRate = new Rate('errors');
const dbReadLatency = new Trend('db_read_latency');
const dbWriteLatency = new Trend('db_write_latency');
const dbJoinLatency = new Trend('db_join_latency');

// Configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 10 },    // Stay at 10 users
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '1m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 100 },  // Ramp up to 100 users
    { duration: '1m', target: 100 },  // Stay at 100 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests should be below 500ms
    errors: ['rate<0.1'],              // Error rate should be less than 10%
    db_read_latency: ['p(95)<200'],    // 95% of reads should be below 200ms
    db_write_latency: ['p(95)<300'],   // 95% of writes should be below 300ms
  },
};

// Base URL for your API (adjust to your actual API endpoint)
const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  // Test 1: Simple SELECT query (Read operation)
  const readStart = Date.now();
  const readResponse = http.get(`${BASE_URL}/api/users/1`);
  const readDuration = Date.now() - readStart;
  dbReadLatency.add(readDuration);
  
  check(readResponse, {
    'read status is 200': (r) => r.status === 200,
    'read response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: JOIN query (Complex read with joins)
  const joinStart = Date.now();
  const joinResponse = http.get(`${BASE_URL}/api/orders/user/1`);
  const joinDuration = Date.now() - joinStart;
  dbJoinLatency.add(joinDuration);
  
  check(joinResponse, {
    'join status is 200': (r) => r.status === 200,
    'join response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);

  // Test 3: INSERT query (Write operation)
  const writeStart = Date.now();
  const writePayload = JSON.stringify({
    username: `user_${__VU}_${__ITER}`,
    email: `user_${__VU}_${__ITER}@test.com`,
    first_name: 'Test',
    last_name: 'User',
  });
  
  const writeResponse = http.post(`${BASE_URL}/api/users`, writePayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  const writeDuration = Date.now() - writeStart;
  dbWriteLatency.add(writeDuration);
  
  check(writeResponse, {
    'write status is 201': (r) => r.status === 201,
    'write response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  sleep(1);

  // Test 4: Complex query with aggregations (OLAP-style)
  const aggregateStart = Date.now();
  const aggregateResponse = http.get(`${BASE_URL}/api/orders/stats`);
  const aggregateDuration = Date.now() - aggregateStart;
  dbReadLatency.add(aggregateDuration);
  
  check(aggregateResponse, {
    'aggregate status is 200': (r) => r.status === 200,
    'aggregate response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  // Simple text summary - you can enhance this
  return `
    ============================================
    Database Performance Test Summary
    ============================================
    Total Requests: ${data.metrics.http_reqs.values.count}
    Failed Requests: ${data.metrics.http_req_failed.values.rate * 100}%
    Average Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
    P95 Response Time: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
    P99 Response Time: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms
    
    Database Metrics:
    - Read Latency (P95): ${data.metrics.db_read_latency.values['p(95)'].toFixed(2)}ms
    - Write Latency (P95): ${data.metrics.db_write_latency.values['p(95)'].toFixed(2)}ms
    - Join Latency (P95): ${data.metrics.db_join_latency.values['p(95)'].toFixed(2)}ms
    ============================================
  `;
}

