import opentelemetry, { context } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ExpressInstrumentation } from '@aspecto/opentelemetry-instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { logger } from '../logger/logger';
import { JAEGER_URL, TEST } from '../config';

const SERVICE_NAME = 'cougarcs-service';
const tracerProvider = new NodeTracerProvider({
	resource: new Resource({
		[SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
	}),
});
const exporter = new JaegerExporter({
	endpoint: JAEGER_URL,
});

const winstonProvider = new WinstonInstrumentation({
	enabled: !TEST,
	logHook: (span, record) => {
		record['resource.service.name'] =
			tracerProvider.resource.attributes['service.name'];
	},
});

registerInstrumentations({
	tracerProvider,
	instrumentations: [
		winstonProvider,
		new ExpressInstrumentation(),
		new HttpInstrumentation(),
	],
});

tracerProvider.addSpanProcessor(new BatchSpanProcessor(exporter));

tracerProvider.register();

export const tracer = opentelemetry.trace.getTracer(SERVICE_NAME);

export const addTraceId = (req, res, next) => {
	const spanContext = opentelemetry.trace.getSpanContext(context.active());
	req.traceId = spanContext && spanContext.traceId;
	next();
};

export const shutdownTracer = () => {
	exporter.shutdown();
	tracerProvider.shutdown();
};

logger.info(`Tracing initialized for ${SERVICE_NAME}`);
