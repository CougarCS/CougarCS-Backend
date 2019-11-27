import { genSalt, hash } from 'bcryptjs';
import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import { sign } from 'jsonwebtoken';
import { s3 } from '../../config/aws';
import auth from '../../middleware/auth';
import Member from '../../models/Member';
import Officer from '../../models/Officer';
import { upload } from '../../uploads/profileImage';


const router = Router();

// @route   GET api/members
// @desc    Get all members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().select('-password');
    res.send(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/:member_id
// @desc    Get an members
// @access  Public
router.get('/:member_id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.member_id);
    if (!member) {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/member;
// @desc    Register a member
// @access  Public
router.post(
  '/',
  [
    check('firstName', 'First Name is required')
      .not()
      .isEmpty(),
    check('lastName', 'Last Name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('PSID', 'Invalid PSID or PSID is required')
      .isNumeric()
      .isLength({ min: 7, max: 7 }),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    const {
      firstName, lastName, email, password, PSID,
    } = req.body;
    try {
      let member = await Member.findOne({ email });
      if (member) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      const profileImageData = {
        profileImage:
          'https://cougarscs-profile-images.s3.us-east-2.amazonaws.com/static/users-01.png',
        profileImageKey: 'static/users-01.png',
      };
      member = new Member({
        firstName,
        lastName,
        PSID,
        email,
        password,
        isOfficer: false,
        profileImageData,
      });

      const salt = await genSalt(10);
      member.password = await hash(password, salt);
      await member.save();
      const payload = {
        member: {
          id: member.id,
        },
      };

      sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },
);

// @route   PUT api/:member_id
// @desc    Update an members
// @access  Private
router.put(
  '/:member_id',
  auth,
  upload.single('profileImage'),
  [
    check('firstName', 'First Name is required')
      .not()
      .isEmpty(),
    check('lastName', 'Last Name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (req.file && req.file.originalname !== 'users-01.png') {
        s3.deleteObject(
          {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.file.key,
          },
          (err) => {
            if (err) res.send({ err });
          },
        );
      }
      return res.status(400).json({ msg: errors.array() });
    }

    const { firstName, lastName, email } = req.body;

    try {
      const member = await Member.findById(req.member.id);
      const lookUpMembers = await Member.find({ email });
      if (req.file) {
        if (lookUpMembers.length === 0 || lookUpMembers[0].id === member.id) {
          const memberDetails = {
            firstName,
            lastName,
            email,
            profileImageData: {
              profileImage: req.file.location,
              profileImageKey: req.file.key,
            },
          };

          if (member) {
            if (
              member.profileImageData.profileImageKey !== 'static/users-01.png'
            ) {
              s3.deleteObject(
                {
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: member.profileImageData.profileImageKey,
                },
                (err) => {
                  if (err) res.send({ err });
                },
              );
            }
            await Member.findByIdAndUpdate(
              req.params.member_id,
              memberDetails,
              (err, obj) => {
                if (err) {
                  return res.status(400).json({
                    errors: [{ msg: 'Error updating' }],
                  });
                }
                return res.json(obj);
              },
            );
          } else {
            if (req.file && req.file.originalname !== 'users-01.png') {
              s3.deleteObject(
                {
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: req.file.key,
                },
                (err) => {
                  if (err) res.send({ err });
                },
              );
            }
            return res
              .status(400)
              .json({ errors: [{ msg: 'Error updating' }] });
          }
        }
      } else {
        if (req.file && req.file.originalname !== 'users-01.png') {
          s3.deleteObject(
            {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: req.file.key,
            },
            (err) => {
              if (err) res.send({ err });
            },
          );
        }
        return res.status(400).json({ errors: [{ msg: 'Error updating' }] });
      }
    } catch (err) {
      if (req.file && req.file.originalname !== 'users-01.png') {
        s3.deleteObject(
          {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.file.key,
          },
          (err2) => {
            if (err2) res.send({ err2 });
          },
        );
      }
      console.error(err);
      return res.status(500).send('Server Error');
    }
  },
);
// @route   DELETE api/:member_id
// @desc    Delete an members
// @access  Private
router.delete('/:member_id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.member_id);
    if (member) {
      if (member.isOfficer) {
        const officer = await Officer.findOne({ member: member.id });

        if (officer) {
          await Officer.findByIdAndDelete(officer.id, (err) => {
            if (err) return res.status(500).send(err);
          });
          await Member.findByIdAndDelete(req.params.member_id, (err, obj) => {
            if (err) return res.status(500).send(err);
            if (
              member.profileImageData.profileImageKey !== 'static/users-01.png'
            ) {
              s3.deleteObject(
                {
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: member.profileImageData.profileImageKey,
                },
                (err2) => {
                  if (err) res.send({ err2 });
                },
              );
            }
            s3.deleteObject(
              {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: member.resumeData.resumeKey,
              },
              (err2) => {
                if (err) res.send({ err2 });
              },
            );
            res.json(obj);
          });
        }
      } else {
        await Member.findByIdAndDelete(
          req.params.member_id,
          async (err, obj) => {
            if (err) return res.status(500).send(err);
            if (
              member.profileImageData.profileImageKey !== 'static/users-01.png'
            ) {
              s3.deleteObject(
                {
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: member.profileImageData.profileImageKey,
                },
                (err2) => {
                  if (err2) res.send({ err2 });
                },
              );
            }
            s3.deleteObject(
              {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: member.resumeData.resumeKey,
              },
              (err2) => {
                if (err) res.send({ err2 });
              },
            );
            res.json(obj);
          },
        );
      }
    } else {
      return res.status(400).json({ msg: 'User not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
