const SPRING_END = { month: 4, day: 13 }; // May 13
const FALL_END = { month: 11, day: 16 }; // December 16

export const getMembershipDates = (paidUntil, today = new Date()) => {
	let membershipStart = {};
	let membershipEnd = {};

	const paidForSemester = paidUntil === 'semester';

	const year = today.getFullYear();

	const terms = {
		spring: new Date(year, SPRING_END.month, SPRING_END.day),
		fall: new Date(year, FALL_END.month, SPRING_END.day),
	};

	// Today is BEFORE last day of Spring
	if (today < terms.spring) {
		membershipStart = { Term: 'Spring', Year: year };
		if (paidForSemester) membershipEnd = { Term: 'Spring', Year: year };
		else membershipEnd = { Term: 'Fall', Year: year };
	}

	// Today is BEFORE last day of Fall
	else if (today < terms.fall) {
		membershipStart = { Term: 'Fall', Year: year };
		if (paidForSemester) membershipEnd = { Term: 'Fall', Year: year };
		else membershipEnd = { Term: 'Spring', Year: year + 1 };
	}

	// Today is AFTER last day of Fall
	else {
		membershipStart = { Term: 'Spring', Year: year + 1 };
		if (paidForSemester) membershipEnd = { Term: 'Spring', Year: year + 1 };
		else membershipEnd = { Term: 'Fall', Year: year + 1 };
	}

	membershipStart.Year = membershipStart.Year.toString();
	membershipEnd.Year = membershipEnd.Year.toString();

	return { membershipStart, membershipEnd };
};
