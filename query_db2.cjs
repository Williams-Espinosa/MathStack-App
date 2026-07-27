const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DB_URL
});

async function run() {
  await client.connect();
  let res = await client.query("SELECT * FROM learning_paths");
  console.log("Learning Paths:");
  console.dir(res.rows);
  
  res = await client.query("SELECT * FROM diagnostic_results");
  console.log("Diagnostics:");
  console.dir(res.rows);
  
  await client.end();
}

run().catch(console.error);
