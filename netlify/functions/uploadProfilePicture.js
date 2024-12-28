const FormData = require('form-data');
const fetch = require('node-fetch');
const airtable = require('airtable');
const base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    try {
      const formData = new FormData();
      const data = await new Promise((resolve, reject) => {
        const chunks = [];
        event.body.on('data', chunk => chunks.push(chunk));
        event.body.on('end', () => resolve(Buffer.concat(chunks)));
      });

      const file = formData.get('file');
      const email = formData.get('email');

      // Upload to Airtable (for simplicity, let's assume file is an image URL)
      const fileUrl = await uploadFileToAirtable(file);
      await base('Users').update([
        {
          id: email, 
          fields: { profilePicture: fileUrl }
        },
      ]);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Profile picture updated successfully!' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};
