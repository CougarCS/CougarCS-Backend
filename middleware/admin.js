import { verify } from 'jsonwebtoken';

export default (req, res, next) => {
  // Get token from the header
  const token = req.header('x-auth-token');
  const admin = req.header('x-admin-token');

  // Check if no token
  if (!token && !(admin === process.env.AUTH_ADMIN)) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // Verify token
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
