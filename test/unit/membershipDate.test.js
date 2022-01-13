import { getMembershipDates } from '../../src/utils/membershipDate';

const SPRING = 'Spring';
const FALL = 'Fall';
const SEMESTER_TERM = 'semester';
const YEAR_TERM = 'year';
const YEAR = '2000';
const NEXT_YEAR = '2001';

describe('Date Member Unit Test', () => {
	test('Jan 1: Semester', () => {
		const date = new Date(YEAR, 0, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(SPRING);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(SPRING);
		expect(membershipEnd.Year).toEqual(YEAR);
	});

	test('Jan 1: Year', () => {
		const date = new Date(YEAR, 0, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(SPRING);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(FALL);
		expect(membershipEnd.Year).toEqual(YEAR);
	});

	// ---

	test('May 13: Semester', () => {
		const date = new Date(YEAR, 4, 13);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(FALL);
		expect(membershipEnd.Year).toEqual(YEAR);
	});

	test('May 13: Year', () => {
		const date = new Date(YEAR, 4, 13);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(SPRING);
		expect(membershipEnd.Year).toEqual(NEXT_YEAR);
	});

	// ---

	test('July 15: Semester', () => {
		const date = new Date(YEAR, 6, 15);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(FALL);
		expect(membershipEnd.Year).toEqual(YEAR);
	});

	test('July 15: Year', () => {
		const date = new Date(YEAR, 6, 15);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(SPRING);
		expect(membershipEnd.Year).toEqual(NEXT_YEAR);
	});

	// ---

	test('August 1: Semester', () => {
		const date = new Date(YEAR, 7, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(FALL);
		expect(membershipEnd.Year).toEqual(YEAR);
	});

	test('August 1: Year', () => {
		const date = new Date(YEAR, 7, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(SPRING);
		expect(membershipEnd.Year).toEqual(NEXT_YEAR);
	});

	// ---

	test('Nov 1: Semester', () => {
		const date = new Date(YEAR, 10, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(FALL);
		expect(membershipEnd.Year).toEqual(YEAR);
	});

	test('Nov 1: Year', () => {
		const date = new Date(YEAR, 10, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(SPRING);
		expect(membershipEnd.Year).toEqual(NEXT_YEAR);
	});

	// ---

	test('Dec 1: Semester', () => {
		const date = new Date(YEAR, 11, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(FALL);
		expect(membershipEnd.Year).toEqual(YEAR);
	});

	test('Dec 1: Year', () => {
		const date = new Date(YEAR, 11, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(FALL);
		expect(membershipStart.Year).toEqual(YEAR);
		expect(membershipEnd.Term).toEqual(SPRING);
		expect(membershipEnd.Year).toEqual(NEXT_YEAR);
	});

	test('Dec 16: Semester', () => {
		const date = new Date(YEAR, 11, 16);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(SPRING);
		expect(membershipStart.Year).toEqual(NEXT_YEAR);
		expect(membershipEnd.Term).toEqual(SPRING);
		expect(membershipEnd.Year).toEqual(NEXT_YEAR);
	});

	// ---

	test('Dec 20: Semester', () => {
		const date = new Date(YEAR, 11, 20);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(SPRING);
		expect(membershipStart.Year).toEqual(NEXT_YEAR);
		expect(membershipEnd.Term).toEqual(SPRING);
		expect(membershipEnd.Year).toEqual(NEXT_YEAR);
	});

	test('Dec 20: Year', () => {
		const date = new Date(YEAR, 11, 20);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toEqual(SPRING);
		expect(membershipStart.Year).toEqual(NEXT_YEAR);
		expect(membershipEnd.Term).toEqual(FALL);
		expect(membershipEnd.Year).toEqual(NEXT_YEAR);
	});
});
