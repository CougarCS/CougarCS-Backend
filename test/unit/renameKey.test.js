import { renameKey } from '../../src/utils/api/utils/utils';

describe('Rename Key Unit Test', () => {
	test('should rename dateTime to date', () => {
		const mockData = { dateTime: '2020-01-01' };
		renameKey(mockData, 'dateTime', 'date');
		expect(mockData).toHaveProperty('date');
	});

	test('should not rename dateTime to date', () => {
		const mockData = { date: '2020-01-01' };
		renameKey(mockData, 'dateTime', 'date');
		expect(mockData).toHaveProperty('date');
	});

	test('should not rename date to date', () => {
		const mockData = { date: null };
		renameKey(mockData, 'date', 'date');
		expect(mockData).toHaveProperty('date');
	});
});
