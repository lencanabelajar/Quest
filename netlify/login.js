const Airtable = require('airtable');

// Konfigurasi Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    // Query data pengguna di Airtable
    const records = await base('Users')
      .select({ filterByFormula: `{email} = "${email}"` })
      .firstPage();

    if (records.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const user = records[0].fields;

    if (user.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid password' }),
      };
    }

    // Berhasil login
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful',
        user: { id: records[0].id, name: user.name, email: user.email },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: error.message }),
    };
  }
};
