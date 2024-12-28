const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  try {
    const records = await base('Tasks')
      .select()
      .firstPage();

    const tasks = records.map(record => ({
      id: record.id,
      title: record.fields.Title,
      description: record.fields.Description,
      difficulty: record.fields.Difficulty,
      question: record.fields.Question,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
