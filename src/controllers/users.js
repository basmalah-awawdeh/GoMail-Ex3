import { v4 as uuidv4 } from 'uuid';

//in-memory user storage
const users = [];

export const registerUser = (req, res) => {
  const { username, password, name, image } = req.body;

  //if username or password is missing, return an error
  if (!username || !password){
    return res.status(400).json({ error: 'Missing credentials' });
  }
  //creating a new user object with a unique id
  const user = { id: uuidv4(), username, password, name, image };

  //saving the user in memory array
  users.push(user);

  //responding with 201 Created and a location header pointing to the new user
  res.status(201).location(`/api/users/${user.id}`).end();
};

export const getUser = (req, res) => {
  //searching for the user in the array by id
  const user = users.find(u => u.id === req.params.id);

  //if not found, return a 404 error
  if (!user){ 
    return res.status(404).json({ error: 'User not found' });
  }
  //return user data as json
  res.json(user);
};

export const loginUser = (req, res) => {
  const { username, password } = req.body;
  //finding the user with matching username and password
  const user = users.find(u => u.username === username && u.password === password);

  //if not found or username or password wrong, return a 401 error
  if (!user){ 
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  //return the user's id
  res.json({ id: user.id });
};
