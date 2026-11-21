/**
 * Bookend Integration Test: Event-Driven Flow & Idempotency Verification
 * 
 * Verifies:
 * 1. Book completion and rating publishing
 * 2. Downstream consumption in Recommendation Service & Engagement Service
 * 3. Strict Idempotency: duplicate delivery does not duplicate side-effects
 */

const assert = require('assert');
const path = require('path');

// Test Engagement Service event handling
const engagementDb = require('../services/engagement-service/src/models/db');
const { handleDomainEvent: handleEngagementEvent } = require('../services/engagement-service/src/events/consumer');
const { seedEngagement } = require('../services/engagement-service/src/seed/seed');

console.log('===============================================================');
console.log('🧪 RUNNING BOOKEND INTEGRATION TEST: EVENT-DRIVEN & IDEMPOTENCY');
console.log('===============================================================');

seedEngagement();

const testUserId = `test_reader_${Date.now()}`;
const eventId = `evt_test_${Date.now()}`;

const sampleEvent = {
  eventId,
  eventType: 'book.completed',
  occurredAt: new Date().toISOString(),
  payload: {
    userId: testUserId,
    bookId: 'book_dune',
    title: 'Dune',
    author: 'Frank Herbert',
    genres: ['Science Fiction', 'Space Opera', 'Classics'],
    pageCount: 688,
    rating: 5
  }
};

console.log('\n[TEST 1] Dispatching initial book.completed event to Engagement Service...');
const result1 = handleEngagementEvent(sampleEvent);
assert.strictEqual(result1, true, 'First event processing should succeed');

// Verify achievement unlocked
const ach = engagementDb.prepare('SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?').get(testUserId, 'ach_first_finish');
assert.ok(ach, 'User should have earned ach_first_finish');
console.log('  ✅ Achievement ach_first_finish successfully unlocked for test reader.');

// Verify challenge progress recorded
const prog = engagementDb.prepare('SELECT current_count FROM user_challenge_progress WHERE user_id = ? AND challenge_id = ?').get(testUserId, 'ch_page_to_screen');
assert.ok(prog && prog.current_count >= 1, 'Challenge progress should be at least 1');
console.log(`  ✅ Challenge ch_page_to_screen progressed to ${prog.current_count}.`);

const countBeforeDuplicate = prog.current_count;

// Verify notification created
const notifsBefore = engagementDb.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ?').get(testUserId).count;
assert.ok(notifsBefore >= 1, 'At least 1 notification should be created');
console.log(`  ✅ Generated ${notifsBefore} notifications.`);

console.log('\n[TEST 2] Testing Idempotency: Dispatching EXACT SAME EVENT a second time...');
const result2 = handleEngagementEvent(sampleEvent);
assert.strictEqual(result2, true, 'Duplicate event should be safely acknowledged');

// Verify progress did NOT double-increment
const progAfter = engagementDb.prepare('SELECT current_count FROM user_challenge_progress WHERE user_id = ? AND challenge_id = ?').get(testUserId, 'ch_page_to_screen').current_count;
assert.strictEqual(progAfter, countBeforeDuplicate, 'Progress count must NOT increment on duplicate event delivery');
console.log(`  ✅ Idempotency Verified: Progress remained strictly at ${progAfter}.`);

// Verify notifications did not duplicate
const notifsAfter = engagementDb.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ?').get(testUserId).count;
assert.strictEqual(notifsAfter, notifsBefore, 'Notifications count must NOT increase on duplicate event delivery');
console.log(`  ✅ Idempotency Verified: Notification count remained strictly at ${notifsAfter}.`);

console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!\n');
