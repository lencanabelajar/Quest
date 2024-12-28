exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Ambil token atau sesi dari body request
    const { token } = JSON.parse(event.body);

    // Validasi input
    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token is required for logout' }),
      };
    }

    // Di sistem sederhana tanpa database sesi: token hanya divalidasi di sisi klien
    // Kirim respons logout berhasil
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Logout successful' }),
    };
  } catch (error) {
    // Tangani error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: error.message }),
    };
  }
};
