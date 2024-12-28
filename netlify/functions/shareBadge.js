const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    try {
      // Ambil data badge dari Airtable
      const badgeRecords = await base('Badges')
        .select({
          maxRecords: 1, // Ambil satu badge terakhir
        })
        .firstPage();

      if (badgeRecords.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'No badge found' }),
        };
      }

      const badge = badgeRecords[0].fields;

      // Logika berbagi badge (misalnya, kirim email atau simpan ke sistem lain)
      // Tambahkan logika berbagi sesuai kebutuhan

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Badge shared successfully!' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};
