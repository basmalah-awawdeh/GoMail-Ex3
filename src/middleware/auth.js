export const authMiddleware = (req, res, next) => {
  //extracting user id from custom header
  const userId = req.headers['x-user-id'];
  //id is missing ==> reject
  if (!userId) return res.status(401).json({ error: 'Missing user ID header' });
  //attaching user id
  req.userId = userId;
  next();
};
