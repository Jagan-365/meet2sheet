
export async function authenticateToken(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).send('Token missing');
      return;
    }

    req.accessToken = token;
    next();
  } catch (err) { 
    if (err.name === 'TokenExpiredError') { 
      res.status(403).json({ data: {message: 'Token expired'} }); 
    } else { 
      res.status(403).json({ data: {message: 'Invalid token'} }); 
    } 
  } 
}