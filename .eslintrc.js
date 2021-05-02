module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: ['airbnb-base', 'prettier'],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	rules: {
		'linebreak-style': ['error', 'unix'],
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				semi: true,
				jsxSingleQuote: true,
				singleQuote: true,
			},
		],
	},
};
