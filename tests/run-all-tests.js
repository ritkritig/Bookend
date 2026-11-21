const { execSync } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('📚 BOOKEND MICROSERVICES TEST SUITE RUNNER');
console.log('====================================================');

const tests = [
  {
    name: 'Integration Test: Event-Driven Flow & Idempotency',
    cmd: `node ${path.join(__dirname, 'integration-event-flow.test.js')}`
  },
  {
    name: 'Recommendation Service: Vector Engine & ShelfMatch',
    cmd: `python -m unittest ${path.join(__dirname, '..', 'services', 'recommendation-service', 'tests', 'test_engine.py')}`
  }
];

let allPassed = true;

for (const t of tests) {
  console.log(`\n▶ Running: ${t.name}`);
  try {
    const output = execSync(t.cmd, { stdio: 'inherit' });
    console.log(`✔ Passed: ${t.name}`);
  } catch (err) {
    console.error(`✖ Failed: ${t.name}`);
    allPassed = false;
  }
}

console.log('\n====================================================');
if (allPassed) {
  console.log('✨ ALL MICROSERVICES TESTS PASSED!');
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}
console.log('====================================================\n');
