import moment from 'moment';

const TERMS = {
	Spring: moment('May 13', 'MMM D'),
	Fall: moment('December 16', 'MMM D'),
};
const FALL = 'Fall';
const SPRING = 'Spring';
const REGISTRATION_DATE = moment();

const membershipStart = {};
const membershipEnd = {};

export const getMembershipDates = (paidUntil) => {
	const isPaidUntilYear = paidUntil === 'year';
	const year = REGISTRATION_DATE.format('YYYY');
	const nextYear = moment().add(1, 'y').format('YYYY');

	const registerBeforeSpring = REGISTRATION_DATE.isBefore(TERMS.Spring);
	const registeSameAfterSpring = REGISTRATION_DATE.isSameOrAfter(
		TERMS.Spring
	);
	const registerBeforeFall = REGISTRATION_DATE.isSameOrBefore(TERMS.Fall);
	const registerSameAfterFall = REGISTRATION_DATE.isSameOrAfter(TERMS.Fall);

	membershipStart.Term = SPRING;
	membershipStart.Year = year;

	membershipEnd.Term = SPRING;
	membershipEnd.Year = year;

	if (registerBeforeSpring && !isPaidUntilYear) {
		membershipEnd.Term = FALL;
	} else if (registerBeforeSpring && isPaidUntilYear) {
		membershipEnd.Year = nextYear;
	} else if (
		registeSameAfterSpring &&
		registerBeforeFall &&
		!isPaidUntilYear
	) {
		membershipStart.Term = FALL;

		membershipEnd.Term = FALL;
	} else if (registeSameAfterSpring &&
		registerBeforeFall &&
		isPaidUntilYear) {
			membershipStart.Term = FALL;
		}
};
