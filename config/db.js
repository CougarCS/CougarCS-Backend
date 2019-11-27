import { connect, connection, disconnect } from 'mongoose';


export const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    try {
      await connect('mongodb://localhost/testing', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
      console.log('Test DB Connected...');
    } catch (err) {
      console.log(err.message);
      process.exit(1);
    }
  } else {
    try {
      await connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
      console.log('Database Connected...');
    } catch (err) {
      console.log(err.message);
      process.exit(1);
    }
  }
};

export const closeDB = () => {
  if (process.env.NODE_ENV === 'test') disconnect();
};
export const dropDB = () => {
  if (process.env.NODE_ENV === 'test') {
    connection.once('connected', () => {
      connection.dropDatabase();
    });
  }
};

export default { connectDB, closeDB, dropDB };
