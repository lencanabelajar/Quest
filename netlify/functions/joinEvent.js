exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { eventName } = JSON.parse(event.body);

    // Simulasi: Tambahkan anggota ke daftar acara di database
    // Bisa ditambahkan logika untuk menyimpan di Airtable atau database lain

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Anda telah bergabung dalam acara: ${eventName}` }),
    };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
};
