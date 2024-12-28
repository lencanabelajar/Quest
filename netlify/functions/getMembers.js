const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  try {
    const records = await base('Members')
      .select()
      .firstPage();

    const members = records.map(record => ({
      username: record.fields.Username,
      avatar: record.fields.Avatar,
      level: record.fields.Level,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(members),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
