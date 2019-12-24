import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import { s3 } from '../../config/aws';
import admin from '../../middleware/admin';
import Member from '../../models/Member';
import Officer from '../../models/Officer';
import { upload } from '../../uploads/profileImage';

const router = Router();

const bucket = process.env.NODE_ENV === 'test' ? process.env.AWS_BUCKET_NAME_TEST : process.env.AWS_BUCKET_NAME;

// @route   GET api/officer
// @desc    Get all officers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const officers = await Officer.find().select('-password');
    res.json(officers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/officer/:officer_id
// @desc    Get specific officers
// @access  Public
router.get('/:officer_id', async (req, res) => {
  try {
    const officers = await Officer.findOne({
      member: req.params.officer_id,
    }).populate('member', [
      'firstName',
      'lastName',
      'email',
      'profileImageData',
    ]);
    if (!officers) {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.json(officers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/member/officer/:officer_id
// @desc    Edit/Add a officer
// @access  Private
router.put(
  '/:officer_id',
  admin,
  upload.single('profileImage'),
  [
    check('firstName', 'First Name is required')
      .not()
      .isEmpty(),
    check('lastName', 'Last Name is required')
      .not()
      .isEmpty(),
    check('position', 'Position is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file.originalname !== 'users-01.png') {
        s3.deleteObject(
          {
            Bucket: bucket,
            Key: req.file.key,
          },
          (err) => {
            if (err) res.send({ err });
          },
        );
      }
      return res.status(400).json({ msg: errors.array() });
    }
    let { isOfficer } = req.body;
    const {
      firstName, lastName, email, position, isCurrent,
    } = req.body;
    isOfficer = isOfficer === 'true';
    const officerModelDetails = {
      member: req.params.officer_id,
      position,
      isCurrent,
    };
    const memberObj = {
      isOfficer,
      firstName,
      lastName,
      email,
      profileImageData: {
        profileImage: req.file.location,
        profileImageKey: req.file.key,
      },
    };

    try {
      let officer = await Officer.findOne({
        member: req.params.officer_id,
      });
      const member = await Member.findById(req.params.officer_id);

      if (officer && isOfficer) {
        if (
          req.file.originalname !== 'users-01.png'
          && member.profileImageData.profileImageKey !== 'static/users-01.png'
        ) {
          s3.deleteObject(
            {
              Bucket: bucket,
              Key: member.profileImageData.profileImageKey,
            },
            (err) => {
              if (err) res.send({ err });
            },
          );
        }
        await Officer.findByIdAndUpdate(
          officer.id,
          officerModelDetails,
          async (err1, data) => {
            const MemberData = data;
            if (err1) {
              return res
                .status(400)
                .json({ errors: [{ msg: 'Error updating' }] });
            }
            await Member.findByIdAndUpdate(
              req.params.officer_id,
              memberObj,
              (err2, obj) => {
                if (err2) {
                  return res
                    .status(400)
                    .json({ errors: [{ msg: 'Error updating member' }] });
                }
                MemberData.md = obj;
              },
            );
            res.json(MemberData);
          },
        );
      } else if (!officer && isOfficer) {
        if (
          req.file.originalname !== 'users-01.png'
          && member.profileImageData.profileImageKey !== 'static/users-01.png'
        ) {
          s3.deleteObject(
            {
              Bucket: bucket,
              Key: member.profileImageData.profileImageKey,
            },
            (err) => {
              if (err) res.send({ err });
            },
          );
        }
        officer = new Officer(officerModelDetails);
        await officer.save();

        await Member.findByIdAndUpdate(
          req.params.officer_id,
          memberObj,
          (err, obj) => {
            if (err) {
              return res
                .status(400)
                .json({ errors: [{ msg: 'Error updating member' }] });
            }
            res.json(obj);
          },
        );
      } else if (officer && !isOfficer) {
        if (
          req.file.originalname !== 'users-01.png'
          && member.profileImageData.profileImageKey !== 'static/users-01.png'
        ) {
          s3.deleteObject(
            {
              Bucket: bucket,
              Key: member.profileImageData.profileImageKey,
            },
            (err) => {
              if (err) res.send({ err });
            },
          );
        }
        await Officer.findByIdAndDelete(officer.id, (err) => {
          if (err) return res.status(500).send(err);
        });
        await Member.findByIdAndUpdate(member.id, { isOfficer: false }, (err) => {
          if (err) {
            return res
              .status(400)
              .json({ errors: [{ msg: 'Error updating' }] });
          }
          res.json({ msg: 'Officer Removed' });
        });
      } else if (!officer && !isOfficer) {
        if (req.file.originalname !== 'users-01.png') {
          s3.deleteObject(
            {
              Bucket: bucket,
              Key: req.file.key,
            },
            (err) => {
              if (err) res.send({ err });
            },
          );
        }
        res.send('Error updating');
      } else {
        if (req.file.originalname !== 'users-01.png') {
          s3.deleteObject(
            {
              Bucket: bucket,
              Key: req.file.key,
            },
            (err) => {
              if (err) res.send({ err });
            },
          );
        }
        res.status(500).send('Officer not found');
      }
    } catch (err) {
      if (req.file.originalname !== 'users-01.png') {
        s3.deleteObject(
          {
            Bucket: bucket,
            Key: req.file.key,
          },
          (err2) => {
            if (err2) res.send({ err2 });
          },
        );
      }
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

export default router;
