const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { itemId } = JSON.parse(event.body);

    try {
      // Mendapatkan item berdasarkan ID dari Airtable
      const itemRecord = await base('StoreItems').find(itemId);

      if (!itemRecord) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Item tidak ditemukan' }),
        };
      }

      const item = itemRecord.fields;
      const newStock = item.Stock - 1; // Mengurangi stok sebanyak 1

      // Memperbarui stok item
      await base('StoreItems').update(itemId, {
        Stock: newStock,
      });

      // Simpan pembelian atau lakukan aksi lain yang diperlukan

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Pembelian berhasil!' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
};
