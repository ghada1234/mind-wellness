// Simple script to check Firebase user count
const admin = require('firebase-admin');

// Initialize Firebase Admin (read-only access)
const serviceAccount = {
  projectId: "mindfulflow-o3lmh",
};

try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: serviceAccount.projectId
  });
} catch (error) {
  // App already initialized or error
}

async function getUserCount() {
  try {
    console.log('🔍 Checking Firebase Authentication users...\n');
    
    let userCount = 0;
    let users = [];
    
    // List all users
    const listAllUsers = async (nextPageToken) => {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      
      result.users.forEach((userRecord) => {
        userCount++;
        users.push({
          email: userRecord.email,
          uid: userRecord.uid,
          created: new Date(userRecord.metadata.creationTime).toLocaleDateString(),
          lastSignIn: userRecord.metadata.lastSignInTime ? 
            new Date(userRecord.metadata.lastSignInTime).toLocaleDateString() : 'Never'
        });
      });
      
      if (result.pageToken) {
        await listAllUsers(result.pageToken);
      }
    };
    
    await listAllUsers();
    
    console.log(`📊 Total Users: ${userCount}\n`);
    
    if (userCount > 0) {
      console.log('👥 Recent Users:');
      console.log('─'.repeat(80));
      users.slice(0, 10).forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Created: ${user.created} | Last Sign In: ${user.lastSignIn}`);
      });
      
      if (userCount > 10) {
        console.log(`\n... and ${userCount - 10} more users`);
      }
    } else {
      console.log('❌ No users found in Firebase Authentication');
      console.log('\n💡 This means:');
      console.log('   - No one has signed up yet');
      console.log('   - Users need to create accounts via /auth/sign-up');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 If you see permission errors, you need to:');
    console.log('   1. Install firebase-admin: npm install firebase-admin');
    console.log('   2. Or check Firebase Console directly');
    process.exit(1);
  }
}

getUserCount();

