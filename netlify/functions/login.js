const users = [
  { email: 'test@example.com', password: 'password123', username: 'Test User' }
];

exports.handler = async function(event, context) {
  const { email, password } = JSON.parse(event.body);

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid credentials' })
    };
  }
};
