import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
  console.log('Connection Established');
});

mongoose.connection.on('reconnected', () => {
  console.log('Connection Reestablished');
});

mongoose.connection.on('disconnected', () => {
  console.log('Connection Disconnected');
});

mongoose.connection.on('close', () => {
  console.log('Connection Closed');
});

mongoose.connection.on('error', error => {
  console.log('ERROR: ' + error);
});

const dbURL = 'mongodb://mongodb/mailaddresscheck';

export const connectDB = async () => {
  await mongoose.connect(dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 20,
  });
};

export const disConnectDB = async () => {
  await mongoose.connection.close(true);
};
