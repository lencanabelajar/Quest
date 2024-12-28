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
    // Ambil data dari body request
    const { name, email, password } = JSON.parse(event.body);

    // Validasi input
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required: name, email, password' }),
      };
    }

    // Cek apakah email sudah terdaftar
    const existingUsers = await base('Users')
      .select({ filterByFormula: `{email} = "${email}"` })
      .firstPage();

    if (existingUsers.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Email already registered' }),
      };
    }

    // Simpan data pengguna baru ke Airtable
    const newUser = await base('Users').create({
      name,
      email,
      password, // Ini hanya untuk demo; sebaiknya hash password (gunakan bcrypt atau library serupa)
    });

    // Kirim respons sukses
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Registration successful',
        user: { id: newUser.id, name: newUser.fields.name, email: newUser.fields.email },
      }),
    };
  } catch (error) {
    // Tangani error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: error.message }),
    };
  }
};
