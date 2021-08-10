import { Router } from 'express';
import APICall from '../../utils/api/calls';

const router = Router();

router.get('/', async (req, res) => {
	console.log('get /api/cougarAPI');
	const user = {
		transaction: 'stripe',
		uhID: '6666666',
		email: 'example@email.com',
		firstName: 'username',
		lastName: 'userlast',
		phoneNumber: '1234567890',
		shirtsize: 'M',
		membershipStart: '10/31/1997',
	};

	const result = await APICall.postContact(user);
	console.log(result);
	return res.status(200).json({ message: 'successful /test' });
});

export default router;
