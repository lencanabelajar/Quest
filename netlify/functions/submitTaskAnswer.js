const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { taskId, answer } = JSON.parse(event.body);

    try {
      // Menyimpan jawaban tugas ke Airtable
      await base('TaskAnswers').create({
        Task: [taskId],
        Answer: answer,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Answer submitted successfully!' }),
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
