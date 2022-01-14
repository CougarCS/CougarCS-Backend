module.exports = {
	env: {
		es6: true,
		node: true,
		"jest/globals": true,
	},
	extends: ['airbnb-base', 'plugin:prettier/recommended', 'plugin:jest/recommended', 'plugin:jest/style'],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	rules: {
		'jest/no-disabled-tests': 'warn',
		'jest/no-focused-tests': 'error',
		'jest/no-identical-title': 'error',
		'jest/prefer-to-have-length': 'warn',
		'jest/valid-expect': 'error',
		'no-param-reassign': 'off',
		'import/prefer-default-export': 'off',
		'global-require': 'off',
		'import/no-unresolved': 'off',
		'import/no-import-module-exports': 'off',
		'linebreak-style': ['error', 'unix'],
		'prettier/prettier': [
			'error',
			{
				trailingComma: 'es5',
				tabWidth: 4,
				useTabs: true,
				semi: true,
				singleQuote: true,
				endOfLine: 'auto'
			},
		],
	},
};
