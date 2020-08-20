// import { genSalt, hash } from 'bcryptjs';
// import { Router } from 'express';
// import Admin from '../../models/Admin';

// const router = Router();

// // @route   GET api/admin/create
// // @desc    Create the admin
// // @access  Private
// router.post('/create', async (req, res) => {
//   try {
//     let admin = await Admin.find();
//     if (admin.length < 1) {
//       admin = new Admin({
//         email: req.body.email,
//         password: req.body.password,
//       });
//       const salt = await genSalt(10);
//       admin.password = await hash(admin.password, salt);
//       admin.save();
//       res.json({ msg: 'Admin created!' });
//     } else {
//       res.status(203).send('Cannot create Admin');
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // @route   GET api/admin/update
// // @desc    Create the admin
// // @access  Private
// router.put('/update', async (req, res) => {
//   try {
//     let admin = await Admin.find();
//     if (admin.length < 1) {
//       admin = new Admin({
//         email: req.body.email,
//         password: req.body.password,
//       });
//       const salt = await genSalt(10);
//       admin.password = await hash(process.env.ADMIN_PASS, salt);
//       admin.save();
//     } else {
//       res.status(500).send('Cannot create Admin');
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
// export default router;
