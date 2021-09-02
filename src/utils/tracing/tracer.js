// const opentelemetry = require('@opentelemetry/api');

// // Not functionally required but gives some insight what happens behind the scenes
// const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// const { registerInstrumentations } = require('@opentelemetry/instrumentation');
// const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
// const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
// const { Resource } = require('@opentelemetry/resources');
// const {
// 	SemanticResourceAttributes: ResourceAttributesSC,
// } = require('@opentelemetry/semantic-conventions');

// const Exporter = ZipkinExporter;

// const {
// 	ExpressInstrumentation,
// } = require('@opentelemetry/instrumentation-express');
// const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

// module.exports = (serviceName) => {
// 	const provider = new NodeTracerProvider({
// 		resource: new Resource({
// 			[ResourceAttributesSC.SERVICE_NAME]: serviceName,
// 		}),
// 	});
// 	registerInstrumentations({
// 		tracerProvider: provider,
// 		instrumentations: [
// 			// Express instrumentation expects HTTP layer to be instrumented
// 			HttpInstrumentation,
// 			ExpressInstrumentation,
// 		],
// 	});

// 	const exporter = new Exporter({
// 		serviceName,
// 	});

// 	provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// 	// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
// 	provider.register();

// 	return opentelemetry.trace.getTracer('express-example');
// };

// import tracing from '@opencensus/nodejs';
// import { ZipkinTraceExporter } from '@opencensus/exporter-zipkin';

// const { tracer } = tracing.start({ samplingRate: 1 });

// // 3. Configure exporter to export traces to Zipkin.
// tracer.registerSpanEventListener(
// 	new ZipkinTraceExporter({
// 		url: 'http://localhost:9411/api/v2/spans',
// 		serviceName: 'cougarcs',
// 	})
// );

// export default tracer;