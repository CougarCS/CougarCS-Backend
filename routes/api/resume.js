// import { Router } from 'express';
// import { check, validationResult } from 'express-validator/check';
// import { s3 } from '../../config/aws';
// import auth from '../../middleware/auth';
// import Member from '../../models/Member';
// import { upload } from '../../uploads/resume';

// const router = Router();

// const bucket = process.env.NODE_ENV === 'test' ? process.env.AWS_BUCKET_NAME_TEST : process.env.AWS_BUCKET_NAME;

// // @route   PUT api/resume
// // @desc    Add or update resume
// // @access  Private
// router.put(
//   '/',
//   auth,
//   check('resume', 'Resume is required'),
//   upload.single('resume'),

//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       s3.deleteObject(
//         {
//           Bucket: bucket,
//           Key: req.file.key,
//         },
//         (err) => {
//           if (err) res.send({ err });
//         },
//       );

//       return res.status(400).json({ msg: errors.array() });
//     }
//     const member = await Member.findById(req.member.id).populate('-password');
//     try {
//       if (member) {
//         if (member.resumeData.resumeKey != null) {
//           s3.deleteObject(
//             {
//               Bucket: bucket,
//               Key: member.resumeData.resumeKey,
//             },
//             (err) => {
//               if (err) return res.send({ err });
//             },
//           );
//         }
//         await Member.findByIdAndUpdate(
//           member.id,
//           {
//             resumeData: {
//               resumeLink: req.file.location,
//               resumeKey: req.file.key,
//             },
//           },
//           (err1) => {
//             if (err1) return res.status(500).send(err1);
//             return res.json({ msg: 'Success' });
//           },
//         );
//       }
//     } catch (err) {
//       s3.deleteObject(
//         {
//           Bucket: bucket,
//           Key: member.resumeData.resumeKey,
//         },
//         (_err) => {
//           if (_err) return res.send({ _err });
//         },
//       );
//       res.status(500).send('Server Error');
//     }
//   },
// );

// // @route   DELETE api/resume
// // @desc    Delete an resume
// // @access  Private
// router.delete('/', auth, async (req, res) => {
//   try {
//     const member = await Member.findById(req.member.id).populate('-password');
//     if (member) {
//       if (Object.entries(member.resumeData)[2][1]) {
//         s3.deleteObject(
//           {
//             Bucket: bucket,
//             Key: member.resumeData.resumeKey,
//           },
//           async () => {
//             await Member.updateOne(
//               { _id: member.id },
//               { $unset: { resumeData: '' } },
//             );
//             res.json({ msg: 'Success' });
//           },
//         );
//       } else {
//         res.status(500).send('Resume not found');
//       }
//     } else {
//       res.status(500).send('Error removing.');
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// export default router;
