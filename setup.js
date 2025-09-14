#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🍽️  FoodShare Setup Script');
console.log('==========================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Function to run command and handle errors
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`🔄 Running: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    console.log('✅ Command completed successfully\n');
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Function to create environment files
function createEnvFiles() {
  console.log('📝 Creating environment files...');
  
  // Server .env
  const serverEnvPath = path.join(__dirname, 'server', '.env');
  const serverEnvExamplePath = path.join(__dirname, 'server', '.env.example');
  
  if (!fs.existsSync(serverEnvPath) && fs.existsSync(serverEnvExamplePath)) {
    fs.copyFileSync(serverEnvExamplePath, serverEnvPath);
    console.log('✅ Created server/.env from .env.example');
  }
  
  // Client .env
  const clientEnvPath = path.join(__dirname, 'client', '.env');
  const clientEnvExamplePath = path.join(__dirname, 'client', '.env.example');
  
  if (!fs.existsSync(clientEnvPath) && fs.existsSync(clientEnvExamplePath)) {
    fs.copyFileSync(clientEnvExamplePath, clientEnvPath);
    console.log('✅ Created client/.env from .env.example');
  }
  
  console.log('\n⚠️  Important: Please update the .env files with your actual configuration values!\n');
}

// Function to install dependencies
function installDependencies() {
  console.log('📦 Installing dependencies...\n');
  
  // Install root dependencies
  console.log('Installing root dependencies...');
  runCommand('npm install');
  
  // Install server dependencies
  console.log('Installing server dependencies...');
  runCommand('npm install', path.join(__dirname, 'server'));
  
  // Install client dependencies
  console.log('Installing client dependencies...');
  runCommand('npm install', path.join(__dirname, 'client'));
}

// Function to check MongoDB connection
function checkMongoDB() {
  console.log('🔍 Checking MongoDB...');
  try {
    execSync('mongod --version', { stdio: 'pipe' });
    console.log('✅ MongoDB is installed');
  } catch (error) {
    console.log('⚠️  MongoDB not found locally');
    console.log('   You can either:');
    console.log('   1. Install MongoDB locally');
    console.log('   2. Use MongoDB Atlas (cloud)');
    console.log('   3. Use Docker: docker run -d -p 27017:27017 mongo:6.0\n');
  }
}

// Function to display next steps
function displayNextSteps() {
  console.log('🎉 Setup completed successfully!\n');
  console.log('📋 Next Steps:');
  console.log('==============');
  console.log('1. Update environment variables in .env files');
  console.log('2. Set up MongoDB (local or cloud)');
  console.log('3. Configure Cloudinary for image uploads (optional)');
  console.log('4. Set up email service for notifications (optional)\n');
  
  console.log('🚀 To start the application:');
  console.log('============================');
  console.log('Development mode (both server and client):');
  console.log('  npm run dev\n');
  
  console.log('Or start individually:');
  console.log('  Server: cd server && npm run dev');
  console.log('  Client: cd client && npm start\n');
  
  console.log('🐳 Using Docker:');
  console.log('================');
  console.log('  docker-compose up --build\n');
  
  console.log('📚 Documentation:');
  console.log('==================');
  console.log('  Check README.md for detailed instructions');
  console.log('  API documentation available at http://localhost:5000');
  console.log('  Client application at http://localhost:3000\n');
  
  console.log('Happy food sharing! 🍽️❤️');
}

// Main setup function
async function setup() {
  try {
    createEnvFiles();
    installDependencies();
    checkMongoDB();
    displayNextSteps();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setup();
}

module.exports = { setup };
