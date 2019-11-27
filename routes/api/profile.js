import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import auth from '../../middleware/auth';
import Profile from '../../models/Profile';

const router = Router();

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      member: req.member.id,
    }).populate('member', ['firstName', 'lastName', 'profileImageData']);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this member' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      twitter,
      linkedin,
    } = req.body;

    // Build profile obj
    const profileFields = {};
    profileFields.member = req.member.id;

    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (githubusername) profileFields.social.githubusername = githubusername;

    try {
      let profile = await Profile.findOne({ member: req.member.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { member: req.member.id },
          { $set: profileFields },
          { new: true },
        );

        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.send(500).send('Server Error');
    }
  },
);

export default router;
