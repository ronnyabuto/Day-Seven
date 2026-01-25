const fs = require('node:fs');
const path = require('node:path');

console.log('🏥 Starting Day Seven Health Check...');

// 1. Check Env Vars
const envPath = path.join(process.cwd(), '.env');
const examplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
    console.error('❌ .env file missing! Please copy .env.example to .env');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const requiredKeys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'MPESA_CONSUMER_KEY',
    'MPESA_CONSUMER_SECRET'
];

const missingKeys = [];
requiredKeys.forEach(key => {
    if (!envContent.includes(key) || envContent.includes(`${key}=your_`)) {
        // Simple check: exists and not default value (rough check)
        // Actually, just checking if key is present is enough for now, 
        // but let's check if it's empty in loaded process if we were parsing.
        // We'll stick to regex check for "your_" which implies placeholder.
        const regex = new RegExp(`${key}=(.*)`);
        const match = envContent.match(regex);
        if (!match || !match[1] || match[1].includes('your_') || match[1].trim() === '') {
            missingKeys.push(key);
        }
    }
});

if (missingKeys.length > 0) {
    console.warn('⚠️  The following Critical Keys are missing or set to defaults in .env:');
    missingKeys.forEach(k => console.warn(`   - ${k}`));
    console.warn('   (The app will run in "Simulation Mode" but Backend actions might fail or log errors.)');
} else {
    console.log('✅ Environment Config lookin good.');
}

console.log('✅ Health Check Complete.');
