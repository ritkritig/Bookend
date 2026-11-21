const { seedUsers } = require('../services/identity-service/src/seed/seed');
const { seedCatalog } = require('../services/catalog-reading-service/src/seed/seed');
const { seedSocial } = require('../services/social-service/src/seed/seed');
const { seedEngagement } = require('../services/engagement-service/src/seed/seed');

console.log('===========================================================');
console.log('🌱 SEEDING ALL BOOKEND MICROSERVICES DATA');
console.log('===========================================================');

try {
  seedUsers();
  seedCatalog();
  seedSocial();
  seedEngagement();
  console.log('\n✨ ALL SERVICES SEEDED SUCCESSFULLY!\n');
} catch (err) {
  console.error('Error seeding services:', err);
  process.exit(1);
}
