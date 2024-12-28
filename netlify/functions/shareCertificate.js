const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    try {
      // Ambil data sertifikat dari Airtable
      const certificateRecords = await base('Certificates')
        .select({
          maxRecords: 1, // Ambil satu sertifikat terakhir
        })
        .firstPage();

      if (certificateRecords.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'No certificate found' }),
        };
      }

      const certificate = certificateRecords[0].fields;

      // Logika berbagi sertifikat (misalnya, kirim email atau simpan ke sistem lain)
      // Tambahkan logika berbagi sesuai kebutuhan, misalnya berbagi ke sosial media

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Certificate shared successfully!' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};
