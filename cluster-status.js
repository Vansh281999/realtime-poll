const dns = require('dns').promises;

async function checkClusterStatus() {
  try {
    console.log('🔍 Checking MongoDB Atlas DNS resolution...');
    
    // Try to resolve SRV records
    const records = await dns.resolveSrv('_mongodb._tcp.cluster0.mongodb.net');
    console.log('✅ SRV records found:', records.length);
    
    records.forEach((record, index) => {
      console.log(`  ${index + 1}. ${record.name}:${record.port}`);
    });
    
    // Check individual hostnames
    for (const record of records) {
      try {
        const addresses = await dns.resolve4(record.name);
        console.log(`✅ ${record.name} resolves to: ${addresses.join(', ')}`);
      } catch (error) {
        console.log(`❌ ${record.name}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Cluster DNS resolution failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Suggestion: Your cluster may still be provisioning');
      console.log('   - Wait 2-3 minutes and try again');
      console.log('   - Check your cluster status in MongoDB Atlas dashboard');
    } else {
      console.log('💡 Suggestion:', error.code);
    }
  }
}

checkClusterStatus();
