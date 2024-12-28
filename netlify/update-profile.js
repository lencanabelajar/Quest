const Airtable = require('airtable');

// Konfigurasi Airtable
const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const USERS_TABLE = 'Users'; // Ganti sesuai dengan nama tabel di Airtable

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parsing body request
    const { token, userId, updateData } = JSON.parse(event.body);

    // Validasi input
    if (!token || !userId || !updateData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token, userId, and updateData are required' }),
      };
    }

    // Opsi: Verifikasi token autentikasi (implementasi token harus dilakukan di sistem frontend/backend)
    // Contoh validasi token sederhana
    if (token !== 'your-secret-token') {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid token' }),
      };
    }

    // Perbarui data pengguna di Airtable
    const updatedRecord = await airtableBase(USERS_TABLE).update(userId, updateData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Profile updated successfully',
        record: updatedRecord,
      }),
    };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update profile', details: error.message }),
    };
  }
};
