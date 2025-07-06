import { execSync } from 'child_process';
import path from 'path';
import { cwd } from 'process';

function run(command: string, workingDir: string = cwd()) {
    console.log(`\n Running: ${command}`);
    execSync(command, { stdio: 'inherit', cwd: workingDir });
}

try {
    console.log('\n Installing Backend dependencies...');
    
    // Step 1: Backend
    const backendPath = path.join(__dirname, 'MemoryVault-server');
    run('npm install', backendPath);
    // Re-generate client
    run('npx prisma generate', backendPath);
    run('npx prisma migrate dev --name init', backendPath);

    // Step 2: Frontend
    console.log('\n Installing Frontend dependencies...');
    const frontendPath = path.join(__dirname, 'MemoryVault-client');
    run('npm install', frontendPath);

    // Step 3: Root
    console.log('\n Installing root-level dependencies...');
    run('npm install', __dirname);

    console.log('\n Setup complete. You can now run the app with: npm run start\n');
} catch (err: any) {
    console.error('\n Setup failed:', err.message);
    process.exit(1);
}