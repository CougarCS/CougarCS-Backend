// import promBundle from 'express-prom-bundle';

// const bundle = promBundle({
// 	buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
// 	includeMethod: true,
// 	includePath: true,
// 	customLabels: { project_name: 'cougarcs-backend', year: null },
// 	transformLabels: (labels) =>
// 		Object.assign(labels, { year: new Date().getFullYear() }),
// 	metricsPath: '/prometheus',
// 	promClient: {
// 		collectDefaultMetrics: {},
// 	},
// 	urlValueParser: {
// 		minHexLength: 5,
// 		extraMasks: [
// 			'^[0-9]+\\.[0-9]+\\.[0-9]+$', // replace dot-separated dates with #val, (regex as string)
// 			/^[0-9]+-[0-9]+-[0-9]+$/, // replace dash-separated dates with #val (actual regex)
// 		],
// 	},
// });

// export { bundle };

import prom from 'prometheus-api-metrics';

export default prom({
	metricsPath: '/prometheus',
});
