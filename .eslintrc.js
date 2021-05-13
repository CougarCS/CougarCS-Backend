module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: ['airbnb-base', 'plugin:prettier/recommended'],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	rules: {
		"no-param-reassign": "off",
		"import/prefer-default-export": "off",
		"global-require": "off",
		"import/no-unresolved": "off",
		'linebreak-style': ['error', 'unix'],
		'prettier/prettier': [
			'error',
			{
				trailingComma: "es5",
				tabWidth: 4,
				useTabs: true,
				semi: true,
				singleQuote: true,
				endOfLine: "auto"
			},
		],
	},
};
