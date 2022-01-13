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
		expect(membershipStart.Term).toBe(SPRING);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(SPRING);
		expect(membershipEnd.Year).toBe(YEAR);
	});

	test('Jan 1: Year', () => {
		const date = new Date(YEAR, 0, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toBe(SPRING);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(FALL);
		expect(membershipEnd.Year).toBe(YEAR);
	});

	// ---

	test('May 13: Semester', () => {
		const date = new Date(YEAR, 4, 13);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(FALL);
		expect(membershipEnd.Year).toBe(YEAR);
	});

	test('May 13: Year', () => {
		const date = new Date(YEAR, 4, 13);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(SPRING);
		expect(membershipEnd.Year).toBe(NEXT_YEAR);
	});

	// ---

	test('July 15: Semester', () => {
		const date = new Date(YEAR, 6, 15);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(FALL);
		expect(membershipEnd.Year).toBe(YEAR);
	});

	test('July 15: Year', () => {
		const date = new Date(YEAR, 6, 15);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(SPRING);
		expect(membershipEnd.Year).toBe(NEXT_YEAR);
	});

	// ---

	test('August 1: Semester', () => {
		const date = new Date(YEAR, 6, 15);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(FALL);
		expect(membershipEnd.Year).toBe(YEAR);
	});

	test('August 1: Year', () => {
		const date = new Date(YEAR, 6, 15);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(SPRING);
		expect(membershipEnd.Year).toBe(NEXT_YEAR);
	});

	// ---

	test('Nov 1: Semester', () => {
		const date = new Date(YEAR, 10, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(FALL);
		expect(membershipEnd.Year).toBe(YEAR);
	});

	test('Nov 1: Year', () => {
		const date = new Date(YEAR, 10, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(SPRING);
		expect(membershipEnd.Year).toBe(NEXT_YEAR);
	});

	// ---

	test('Dec 1: Semester', () => {
		const date = new Date(YEAR, 11, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(FALL);
		expect(membershipEnd.Year).toBe(YEAR);
	});

	test('Dec 1: Year', () => {
		const date = new Date(YEAR, 11, 1);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toBe(FALL);
		expect(membershipStart.Year).toBe(YEAR);
		expect(membershipEnd.Term).toBe(SPRING);
		expect(membershipEnd.Year).toBe(NEXT_YEAR);
	});

	// ---

	test('Dec 20: Semester', () => {
		const date = new Date(YEAR, 11, 20);
		const { membershipStart, membershipEnd } = getMembershipDates(
			SEMESTER_TERM,
			date
		);
		expect(membershipStart.Term).toBe(SPRING);
		expect(membershipStart.Year).toBe(NEXT_YEAR);
		expect(membershipEnd.Term).toBe(SPRING);
		expect(membershipEnd.Year).toBe(NEXT_YEAR);
	});

	test('Dec 20: Year', () => {
		const date = new Date(YEAR, 11, 20);
		const { membershipStart, membershipEnd } = getMembershipDates(
			YEAR_TERM,
			date
		);
		expect(membershipStart.Term).toBe(SPRING);
		expect(membershipStart.Year).toBe(NEXT_YEAR);
		expect(membershipEnd.Term).toBe(FALL);
		expect(membershipEnd.Year).toBe(NEXT_YEAR);
	});
});
