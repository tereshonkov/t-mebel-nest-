const { execSync } = require('child_process');
const path = require('path');

try {
  require('dotenv').config({
    path: path.join(__dirname, '..', '.env.test'),
  });
} catch {
  // dotenv optional if not installed at root
}

module.exports = async function globalSetup() {
  if (!process.env.DATABASE_URL) {
    console.warn(
      '[e2e] DATABASE_URL is not set; skipped prisma migrate deploy',
    );
    return;
  }
  const projectRoot = path.resolve(__dirname, '..');
  execSync('npx prisma migrate deploy', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env,
  });
};
