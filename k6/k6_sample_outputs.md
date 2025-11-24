# k6 Sample Outputs - Different Performance Scenarios

This document shows what k6 output looks like under different database performance conditions. Use this as a reference to understand what good vs. poor performance looks like.

## Scenario 1: Optimal Performance (Well-Tuned Database)

**Conditions:** All indexes in place, proper connection pooling, optimized queries

```
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: load_test.js
     output: -

  scenarios: (100.0%) 1 scenario, 100 max VUs, 5m0s max duration (incl. graceful stop):
           * default: Up to 100 looping VUs for 5m0s over 4 stages (gracefulRampDown: 30s, gracefulStop: 30s)

     ✓ read status is 200
     ✓ read response time < 200ms
     ✓ join status is 200
     ✓ join response time < 500ms
     ✓ write status is 201
     ✓ write response time < 300ms
     ✓ aggregate status is 200
     ✓ aggregate response time < 1000ms

     checks.........................: 100.00% ✓ 2400    ✗ 0
     data_received..................: 2.1 MB  7.0 kB/s
     data_sent......................: 1.8 MB  6.0 kB/s
     db_join_latency...............: avg=45ms    min=12ms   med=42ms   max=180ms   p(90)=78ms   p(95)=95ms
     db_read_latency................: avg=15ms    min=3ms    med=14ms   max=85ms    p(90)=28ms   p(95)=35ms
     db_write_latency...............: avg=25ms    min=5ms    med=23ms   max=120ms   p(90)=45ms   p(95)=58ms
     http_req_blocked...............: avg=120µs   min=0s     med=0s     max=2ms     p(90)=0s     p(95)=1ms
     http_req_connecting............: avg=80µs    min=0s     med=0s     max=1.5ms    p(90)=0s     p(95)=0s
     http_req_duration..............: avg=28ms   min=5ms    med=25ms   max=200ms   p(90)=52ms   p(95)=68ms
       { expected_response:true }...: avg=28ms   min=5ms    med=25ms   max=200ms   p(90)=52ms   p(95)=68ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 600
     http_req_receiving.............: avg=120µs  min=20µs   med=100µs  max=2ms     p(90)=250µs  p(95)=400µs
     http_req_sending...............: avg=50µs   min=10µs   med=40µs   max=800µs   p(90)=100µs  p(95)=150µs
     http_req_waiting...............: avg=28ms   min=5ms    med=25ms   max=198ms   p(90)=52ms   p(95)=68ms
     http_reqs......................: 600     2.0/s
     iteration_duration.............: avg=4.1s   min=4.0s   med=4.0s   max=4.5s    p(90)=4.2s   p(95)=4.3s
     iterations.....................: 150     0.5/s
     vus............................: 100     min=1       max=100
     vus_max........................: 100     min=1       max=100

    ============================================
    Database Performance Test Summary
    ============================================
    Total Requests: 600
    Failed Requests: 0.00%
    Average Response Time: 28.15ms
    P95 Response Time: 68.42ms
    P99 Response Time: 125.30ms
    
    Database Metrics:
    - Read Latency (P95): 35.12ms
    - Write Latency (P95): 58.75ms
    - Join Latency (P95): 95.23ms
    ============================================
```

**Key Indicators:**
- ✅ All checks passing (100%)
- ✅ P95 response times well below thresholds
- ✅ Zero failed requests
- ✅ Low and consistent latency across all operations

---

## Scenario 2: Missing Indexes (Poor Performance)

**Conditions:** Indexes removed from foreign keys and commonly queried columns

```
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: load_test.js
     output: -

  scenarios: (100.0%) 1 scenario, 100 max VUs, 5m0s max duration (incl. graceful stop):
           * default: Up to 100 looping VUs for 5m0s over 4 stages (gracefulRampDown: 30s, gracefulStop: 30s)

     ✗ read status is 200
       ↳  98% — 588/600
     ✗ read response time < 200ms
       ↳  45% — 270/600
     ✓ join status is 200
     ✗ join response time < 500ms
       ↳  12% — 72/600
     ✗ write status is 201
       ↳  95% — 570/600
     ✗ write response time < 300ms
       ↳  38% — 228/600
     ✓ aggregate status is 200
     ✗ aggregate response time < 1000ms
       ↳  8% — 48/600

     checks.........................: 52.25% ✓ 1254    ✗ 1146
     data_received..................: 1.9 MB  6.3 kB/s
     data_sent......................: 1.6 MB  5.3 kB/s
     db_join_latency...............: avg=850ms   min=120ms  med=780ms  max=3500ms  p(90)=1450ms p(95)=1800ms
     db_read_latency................: avg=320ms   min=45ms   med=280ms  max=2800ms  p(90)=650ms  p(95)=850ms
     db_write_latency...............: avg=450ms   min=80ms   med=420ms  max=3200ms  p(90)=920ms  p(95)=1200ms
     http_req_blocked...............: avg=150µs   min=0s     med=0s     max=3ms     p(90)=0s     p(95)=2ms
     http_req_connecting............: avg=100µs   min=0s     med=0s     max=2ms     p(90)=0s     p(95)=1ms
     http_req_duration..............: avg=420ms   min=50ms   med=380ms  max=3500ms  p(90)=850ms  p(95)=1100ms
       { expected_response:true }...: avg=420ms   min=50ms   med=380ms  max=3500ms  p(90)=850ms  p(95)=1100ms
     http_req_failed................: 5.00%   ✓ 30      ✗ 570
     http_req_receiving.............: avg=200µs  min=30µs   med=150µs  max=5ms     p(90)=500µs  p(95)=1ms
     http_req_sending...............: avg=60µs   min=15µs   med=50µs   max=1.2ms   p(90)=120µs  p(95)=200µs
     http_req_waiting...............: avg=419ms  min=50ms   med=379ms  max=3498ms  p(90)=849ms  p(95)=1099ms
     http_reqs......................: 600     2.0/s
     iteration_duration.............: avg=4.8s   min=4.2s   med=4.6s   max=8.5s    p(90)=6.2s   p(95)=7.1s
     iterations.....................: 125     0.4/s
     vus............................: 100     min=1       max=100
     vus_max........................: 100     min=1       max=100

    ============================================
    Database Performance Test Summary
    ============================================
    Total Requests: 600
    Failed Requests: 5.00%
    Average Response Time: 420.35ms
    P95 Response Time: 1100.25ms
    P99 Response Time: 2800.50ms
    
    Database Metrics:
    - Read Latency (P95): 850.12ms  ⚠️ EXCEEDS THRESHOLD (200ms)
    - Write Latency (P95): 1200.45ms  ⚠️ EXCEEDS THRESHOLD (300ms)
    - Join Latency (P95): 1800.78ms  ⚠️ EXCEEDS THRESHOLD (500ms)
    ============================================
```

**Key Indicators:**
- ❌ Many checks failing (52.25% pass rate)
- ❌ P95 latencies 3-4x higher than thresholds
- ❌ 5% request failure rate
- ❌ High variance in response times (min vs max)
- ⚠️ **Action Required:** Add missing indexes

---

## Scenario 3: Connection Pool Exhaustion

**Conditions:** Connection pool limit too low (2 connections) with 100 concurrent users

```
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: load_test.js
     output: -

  scenarios: (100.0%) 1 scenario, 100 max VUs, 5m0s max duration (incl. graceful stop):
           * default: Up to 100 looping VUs for 5m0s over 4 stages (gracefulRampDown: 30s, gracefulStop: 30s)

     ✗ read status is 200
       ↳  62% — 372/600
     ✗ read response time < 200ms
       ↳  15% — 90/600
     ✗ join status is 200
       ↳  58% — 348/600
     ✗ join response time < 500ms
       ↳  5% — 30/600
     ✗ write status is 201
       ↳  55% — 330/600
     ✗ write response time < 300ms
       ↳  12% — 72/600
     ✗ aggregate status is 200
       ↳  60% — 360/600
     ✗ aggregate response time < 1000ms
       ↳  3% — 18/600

     checks.........................: 28.50% ✓ 684     ✗ 1716
     data_received..................: 1.2 MB  4.0 kB/s
     data_sent......................: 1.0 MB  3.3 kB/s
     db_join_latency...............: avg=2200ms  min=200ms  med=1950ms max=8000ms  p(90)=4500ms p(95)=6200ms
     db_read_latency................: avg=1800ms  min=150ms  med=1650ms max=7500ms  p(90)=3800ms p(95)=5200ms
     db_write_latency...............: avg=2500ms  min=200ms  med=2300ms max=8500ms  p(90)=5200ms p(95)=6800ms
     http_req_blocked...............: avg=500µs   min=0s     med=0s     max=15ms    p(90)=2ms    p(95)=5ms
     http_req_connecting............: avg=300µs   min=0s     med=0s     max=12ms    p(90)=1ms    p(95)=3ms
     http_req_duration..............: avg=2100ms min=200ms  med=1950ms max=8500ms  p(90)=4500ms p(95)=6200ms
       { expected_response:true }...: avg=2100ms min=200ms  med=1950ms max=8500ms  p(90)=4500ms p(95)=6200ms
     http_req_failed................: 38.50%  ✓ 231     ✗ 369
     http_req_receiving.............: avg=300µs  min=50µs   med=200µs  max=8ms     p(90)=800µs  p(95)=1.5ms
     http_req_sending...............: avg=80µs   min=20µs   med=70µs   max=2ms     p(90)=200µs  p(95)=400µs
     http_req_waiting...............: avg=2099ms min=199ms med=1949ms max=8498ms  p(90)=4499ms p(95)=6199ms
     http_reqs......................: 600     2.0/s
     iteration_duration.............: avg=8.5s   min=4.5s   med=8.2s   max=12.5s   p(90)=10.8s  p(95)=11.5s
     iterations.....................: 71      0.2/s
     vus............................: 100     min=1       max=100
     vus_max........................: 100     min=1       max=100

    ============================================
    Database Performance Test Summary
    ============================================
    Total Requests: 600
    Failed Requests: 38.50%
    Average Response Time: 2100.45ms
    P95 Response Time: 6200.25ms
    P99 Response Time: 7800.50ms
    
    Database Metrics:
    - Read Latency (P95): 5200.12ms  ⚠️ CRITICAL - 26x threshold
    - Write Latency (P95): 6800.45ms  ⚠️ CRITICAL - 22x threshold
    - Join Latency (P95): 6200.78ms  ⚠️ CRITICAL - 12x threshold
    ============================================
```

**Key Indicators:**
- ❌ Very high failure rate (38.5%)
- ❌ Extremely high latencies (seconds, not milliseconds)
- ❌ Many timeouts and connection errors
- ⚠️ **Action Required:** Increase connection pool size

---

## Scenario 4: High Load - Database Under Stress

**Conditions:** 500 concurrent users, well-tuned database but hitting limits

```
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: load_test.js
     output: -

  scenarios: (100.0%) 1 scenario, 500 max VUs, 10m0s max duration (incl. graceful stop):
           * default: Up to 500 looping VUs for 10m0s over 6 stages (gracefulRampDown: 30s, gracefulStop: 30s)

     ✓ read status is 200
     ✗ read response time < 200ms
       ↳  78% — 2340/3000
     ✓ join status is 200
     ✗ join response time < 500ms
       ↳  65% — 1950/3000
     ✓ write status is 201
     ✗ write response time < 300ms
       ↳  72% — 2160/3000
     ✓ aggregate status is 200
     ✗ aggregate response time < 1000ms
       ↳  58% — 1740/3000

     checks.........................: 73.25% ✓ 2196    ✗ 804
     data_received..................: 10.5 MB  17.5 kB/s
     data_sent......................: 9.2 MB   15.3 kB/s
     db_join_latency...............: avg=380ms   min=45ms   med=350ms  max=1800ms  p(90)=650ms  p(95)=820ms
     db_read_latency................: avg=180ms   min=8ms    med=165ms  max=1200ms  p(90)=320ms  p(95)=420ms
     db_write_latency...............: avg=280ms   min=12ms   med=260ms  max=1500ms  p(90)=520ms  p(95)=680ms
     http_req_blocked...............: avg=200µs   min=0s     med=0s     max=8ms     p(90)=1ms    p(95)=2ms
     http_req_connecting............: avg=120µs  min=0s     med=0s     max=5ms     p(90)=0s     p(95)=1ms
     http_req_duration..............: avg=280ms   min=10ms   med=260ms  max=1800ms  p(90)=520ms  p(95)=680ms
       { expected_response:true }...: avg=280ms   min=10ms   med=260ms  max=1800ms  p(90)=520ms  p(95)=680ms
     http_req_failed................: 2.00%   ✓ 60      ✗ 2940
     http_req_receiving.............: avg=180µs  min=30µs   med=150µs  max=3ms     p(90)=400µs  p(95)=600µs
     http_req_sending...............: avg=70µs   min=15µs   med=60µs   max=1.5ms   p(90)=150µs  p(95)=250µs
     http_req_waiting...............: avg=279ms  min=10ms   med=259ms  max=1798ms  p(90)=519ms  p(95)=679ms
     http_reqs......................: 3000    5.0/s
     iteration_duration.............: avg=4.3s   min=4.0s   med=4.2s   max=6.5s    p(90)=5.2s   p(95)=5.8s
     iterations.....................: 750     1.25/s
     vus............................: 500     min=1       max=500
     vus_max........................: 500     min=1       max=500

    ============================================
    Database Performance Test Summary
    ============================================
    Total Requests: 3000
    Failed Requests: 2.00%
    Average Response Time: 280.15ms
    P95 Response Time: 680.42ms
    P99 Response Time: 1200.30ms
    
    Database Metrics:
    - Read Latency (P95): 420.12ms  ⚠️ EXCEEDS THRESHOLD (200ms)
    - Write Latency (P95): 680.75ms  ⚠️ EXCEEDS THRESHOLD (300ms)
    - Join Latency (P95): 820.23ms  ⚠️ EXCEEDS THRESHOLD (500ms)
    ============================================
```

**Key Indicators:**
- ⚠️ Degraded performance under high load
- ⚠️ Some threshold violations but still functional
- ⚠️ 2% failure rate (acceptable but not ideal)
- 💡 **Action:** Consider horizontal scaling or query optimization

---

## Scenario 5: Database Not Running / Connection Failed

**Conditions:** MySQL server is down or database doesn't exist

```
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: load_test.js
     output: -

  scenarios: (100.0%) 1 scenario, 100 max VUs, 5m0s max duration (incl. graceful stop):
           * default: Up to 100 looping VUs for 5m0s over 4 stages (gracefulRampDown: 30s, gracefulStop: 30s)

     ✗ read status is 200
       ↳  0% — 0/600
     ✗ read response time < 200ms
       ↳  0% — 0/600
     ✗ join status is 200
       ↳  0% — 0/600
     ✗ join response time < 500ms
       ↳  0% — 0/600
     ✗ write status is 201
       ↳  0% — 0/600
     ✗ write response time < 300ms
       ↳  0% — 0/600
     ✗ aggregate status is 200
       ↳  0% — 0/600
     ✗ aggregate response time < 1000ms
       ↳  0% — 0/600

     checks.........................: 0.00%   ✓ 0       ✗ 2400
     data_received..................: 0 B     0 B/s
     data_sent......................: 0 B     0 B/s
     db_join_latency...............: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     db_read_latency................: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     db_write_latency...............: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     http_req_blocked...............: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     http_req_connecting............: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     http_req_duration..............: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     http_req_failed................: 100.00%  ✓ 600     ✗ 0
     http_req_receiving.............: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     http_req_sending...............: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=0s     min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s
     http_reqs......................: 600     2.0/s
     iteration_duration.............: avg=4.0s   min=4.0s   med=4.0s   max=4.0s    p(90)=4.0s   p(95)=4.0s
     iterations.....................: 150     0.5/s
     vus............................: 100     min=1       max=100
     vus_max........................: 100     min=1       max=100

    ============================================
    Database Performance Test Summary
    ============================================
    Total Requests: 600
    Failed Requests: 100.00%
    Average Response Time: 0.00ms
    P95 Response Time: 0.00ms
    
    Database Metrics:
    - Read Latency (P95): 0.00ms
    - Write Latency (P95): 0.00ms
    - Join Latency (P95): 0.00ms
    ============================================
```

**Key Indicators:**
- ❌ 100% failure rate
- ❌ Zero successful requests
- ❌ All checks failing
- ⚠️ **Action Required:** Start MySQL server and verify database exists

---

## Understanding the Metrics

### Key Metrics to Watch

1. **http_req_duration (P95/P99)**
   - Target: < 500ms
   - Shows overall API response time

2. **db_read_latency (P95)**
   - Target: < 200ms
   - Measures SELECT query performance

3. **db_write_latency (P95)**
   - Target: < 300ms
   - Measures INSERT/UPDATE performance

4. **db_join_latency (P95)**
   - Target: < 500ms
   - Measures complex JOIN query performance

5. **http_req_failed**
   - Target: < 1%
   - Should be near zero for healthy system

6. **checks pass rate**
   - Target: > 95%
   - Shows how many assertions passed

### Percentiles Explained

- **p(50) / med**: Median - 50% of requests faster than this
- **p(90)**: 90% of requests faster than this
- **p(95)**: 95% of requests faster than this (most important)
- **p(99)**: 99% of requests faster than this (catches outliers)

### What Good Performance Looks Like

✅ All checks passing (>95%)  
✅ P95 latencies below thresholds  
✅ Low failure rate (<1%)  
✅ Consistent performance (low variance between min/max)  
✅ High throughput (requests/second)

### Red Flags

❌ High failure rate (>5%)  
❌ P95 latencies 2x+ above thresholds  
❌ High variance (max >> p95)  
❌ Degrading performance over time  
❌ Connection pool exhaustion errors

---

## Tuning Checklist Based on Results

### If Read Latency is High
- [ ] Add indexes on WHERE clause columns
- [ ] Add covering indexes
- [ ] Optimize SELECT queries (avoid SELECT *)
- [ ] Consider read replicas

### If Write Latency is High
- [ ] Check for lock contention
- [ ] Optimize indexes (too many indexes slow writes)
- [ ] Batch inserts when possible
- [ ] Consider async writes for non-critical data

### If Join Latency is High
- [ ] Add indexes on JOIN columns
- [ ] Review JOIN order and types
- [ ] Consider denormalization
- [ ] Use EXPLAIN to analyze query plans

### If High Failure Rate
- [ ] Check connection pool size
- [ ] Verify database is running
- [ ] Check for deadlocks
- [ ] Review error logs

### If Performance Degrades Under Load
- [ ] Increase connection pool
- [ ] Add database replicas
- [ ] Implement caching layer
- [ ] Consider query result caching

