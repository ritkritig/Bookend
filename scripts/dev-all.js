const { spawn, execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Clean up any stale listeners on Bookend ports before boot
function freeStalePorts() {
  const ports = [3000, 4000, 4001, 4002, 4003, 4004, 4005];
  if (process.platform === 'win32') {
    ports.forEach(port => {
      try {
        const out = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
        out.split('\n').forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5 && parts[1].endsWith(`:${port}`) && parts[3] === 'LISTENING') {
            const pid = parts[4];
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
            } catch {}
          }
        });
      } catch {}
    });
  }
}

console.log('================================================================');
console.log('🚀 BOOKEND: LAUNCHING COMPLETE MICROSERVICES ECOSYSTEM');
console.log('================================================================');

console.log('🧹 Clearing stale port listeners...');
freeStalePorts();

const SERVICES = [
  {
    name: 'IDENTITY',
    cmd: 'node',
    args: [path.join(ROOT_DIR, 'services', 'identity-service', 'src', 'index.js')],
    color: '\x1b[35m' // Magenta
  },
  {
    name: 'CATALOG',
    cmd: 'node',
    args: [path.join(ROOT_DIR, 'services', 'catalog-reading-service', 'src', 'index.js')],
    color: '\x1b[34m' // Blue
  },
  {
    name: 'SOCIAL',
    cmd: 'node',
    args: [path.join(ROOT_DIR, 'services', 'social-service', 'src', 'index.js')],
    color: '\x1b[36m' // Cyan
  },
  {
    name: 'RECOMMEND',
    cmd: 'python',
    args: ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '4004', '--app-dir', path.join(ROOT_DIR, 'services', 'recommendation-service')],
    color: '\x1b[32m' // Green
  },
  {
    name: 'ENGAGEMENT',
    cmd: 'node',
    args: [path.join(ROOT_DIR, 'services', 'engagement-service', 'src', 'index.js')],
    color: '\x1b[33m' // Yellow
  },
  {
    name: 'GATEWAY',
    cmd: 'node',
    args: [path.join(ROOT_DIR, 'services', 'api-gateway', 'src', 'index.js')],
    color: '\x1b[31m' // Red
  },
  {
    name: 'FRONTEND',
    cmd: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'dev'],
    cwd: path.join(ROOT_DIR, 'frontend'),
    color: '\x1b[37m' // White
  }
];

const RESET = '\x1b[0m';
const children = [];

function startService(svc) {
  const child = spawn(svc.cmd, svc.args, {
    cwd: svc.cwd || ROOT_DIR,
    env: { ...process.env },
    shell: true
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${svc.color}[${svc.name}]${RESET} ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`${svc.color}[${svc.name} ERR]${RESET} ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`${svc.color}[${svc.name}]${RESET} Process exited with code ${code}`);
  });

  children.push(child);
}

// Start all services
SERVICES.forEach(startService);

console.log('\n✨ All 7 services initializing...');
console.log('  • API Gateway:    http://localhost:4000');
console.log('  • Identity Svc:   http://localhost:4001');
console.log('  • Catalog Svc:    http://localhost:4002');
console.log('  • Social Svc:     http://localhost:4003');
console.log('  • NextRead Svc:   http://localhost:4004');
console.log('  • Engagement Svc: http://localhost:4005');
console.log('  • Frontend SPA:   http://localhost:3000\n');
console.log('Press Ctrl+C to stop all services.\n');

function shutdown() {
  console.log('\n🛑 Shutting down all Bookend services...');
  children.forEach(child => {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', child.pid, '/f', '/t']);
      } else {
        child.kill('SIGTERM');
      }
    } catch {
      // Ignore
    }
  });
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
