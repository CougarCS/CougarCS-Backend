import opentelemetry, { context } from '@opentelemetry/api';
import { TEST } from '../config';

export const getSpanWrapper = () => {
	if (!TEST) {
		return opentelemetry.trace.getSpan(context.active());
	}
	return null;
};

export const endSpanWrapper = (span) => !TEST && span.end();
