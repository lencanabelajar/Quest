const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  try {
    // Mengambil item toko dari Airtable
    const records = await base('StoreItems')
      .select()
      .firstPage();

    // Menyiapkan data item
    const items = records.map(record => ({
      id: record.id,
      name: record.fields.Name,
      description: record.fields.Description,
      price: record.fields.Price,
      image: record.fields.Image[0].url, // Asumsi gambar disimpan dalam array
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
