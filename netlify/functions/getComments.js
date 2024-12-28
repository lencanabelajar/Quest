const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  try {
    const records = await base('Comments')
      .select()
      .firstPage();

    const comments = records.map(record => ({
      username: record.fields.Username,
      text: record.fields.Text,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(comments),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
