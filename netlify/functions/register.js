const users = [];

exports.handler = async function(event, context) {
  const { email, password } = JSON.parse(event.body);

  if (users.some(u => u.email === email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Email already exists' })
    };
  }

  const newUser = { email, password, username: email };
  users.push(newUser);

  return {
    statusCode: 201,
    body: JSON.stringify(newUser)
  };
};
