import 'dotenv/config';
import app from './src/config/app';

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
	if (err) throw err;
	console.info(`Running on port ${PORT}`);
});
