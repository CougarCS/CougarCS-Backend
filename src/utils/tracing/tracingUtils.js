import * as opentracing from 'opentracing';
import { tracer } from './tracer';

export function createControllerSpan(controller, operation, headers) {
	let traceSpan;
	const parentSpanContext = tracer.extract(
		opentracing.FORMAT_HTTP_HEADERS,
		headers
	);
	if (parentSpanContext) {
		traceSpan = tracer.startSpan(operation, {
			childOf: parentSpanContext,
			tags: {
				[opentracing.Tags.SPAN_KIND]:
					opentracing.Tags.SPAN_KIND_RPC_SERVER,
				[opentracing.Tags.COMPONENT]: controller,
			},
		});
	} else {
		traceSpan = tracer.startSpan(operation, {
			tags: {
				[opentracing.Tags.SPAN_KIND]:
					opentracing.Tags.SPAN_KIND_RPC_SERVER,
				[opentracing.Tags.COMPONENT]: controller,
			},
		});
	}
	return traceSpan;
}

export function finishSpanWithResult(span, status, errorTag) {
	span.setTag(opentracing.Tags.HTTP_STATUS_CODE, status);
	if (errorTag) {
		span.setTag(opentracing.Tags.ERROR, true);
	}
	span.finish();
}
