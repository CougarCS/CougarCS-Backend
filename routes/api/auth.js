// import { compare } from 'bcryptjs';
// import { Router } from 'express';
// import { check, validationResult } from 'express-validator/check';
// import { sign } from 'jsonwebtoken';
// import auth from '../../middleware/auth';
// import Admin from '../../models/Admin';
// import Member from '../../models/Member';

// const router = Router();

// // @route   GET api/auth
// // @desc    Get all members
// // @access  Public
// router.get('/', auth, async (req, res) => {
//   try {
//     const member = await Member.findById(req.member.id).select('-password');
//     res.json(member);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// // @route   POST api/auth
// // @desc    Authenticate user & get token
// // @access  Public
// router.post(
//   '/',
//   [
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Password is required').exists(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     try {
//       // See if member exists
//       const member = await Member.findOne({ email });
//       if (!member) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Credentials' }] });
//       }

//       const isMatch = await compare(password, member.password);
//       if (!isMatch) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Credentials' }] });
//       }
//       // Return jsonwebtoken
//       const payload = {
//         member: {
//           id: member.id,
//         },
//       };

//       sign(
//         payload,
//         process.env.JWT_SECRET,
//         {
//           expiresIn: 360000,
//         },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         },
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   },
// );

// // @route   POST api/auth/admin
// // @desc    Authenticate admin & get token
// // @access  Public
// router.post(
//   '/admin',
//   [
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Password is required').exists(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;
//     try {
//       // See if member exists
//       const admin = await Admin.findOne({ email });
//       if (!admin) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Credentials' }] });
//       }

//       const isMatch = await compare(password, admin.password);
//       if (!isMatch) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Invalid Credentials' }] });
//       }
//       // Return jsonwebtoken
//       const payload = {
//         admin: {
//           id: admin.id,
//         },
//       };

//       sign(
//         payload,
//         process.env.JWT_SECRET,
//         {
//           expiresIn: 360000,
//         },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         },
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   },
// );
// export default router;
