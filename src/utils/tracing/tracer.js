import opentelemetry, { context } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ExpressInstrumentation } from '@aspecto/opentelemetry-instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { logger } from '../logger/logger';
import { JAEGER_URL } from '../config';

const SERVICE_NAME = 'cougarcs-service';
const tracerProvider = new NodeTracerProvider({
	resource: new Resource({
		[SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
	}),
});
const exporter = new JaegerExporter({
	endpoint: JAEGER_URL,
});
registerInstrumentations({
	tracerProvider,
	instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
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
