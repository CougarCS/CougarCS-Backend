// import { verify } from 'jsonwebtoken';

// export default (req, res, next) => {
//   // Get token from the header
//   const token = req.header('x-auth-token');
//   const admin = req.header('x-admin-token');

//   // Check if no token
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }
//   // Verify token
//   if (token || admin) {
//     try {
//       const decoded = verify(token, process.env.JWT_SECRET);
//       req.member = decoded.member;
//       next();
//     } catch (err) {
//       res.status(401).json({ msg: 'Token is not valid' });
//     }
//   }
// };
