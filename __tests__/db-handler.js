import mongoose from 'mongoose';
import { MonboMemoryServer, MongoMemoryServer } from 'mongodb-memory-server';

let mongo = null;

export const connectDatabase = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    useNewUrlparser: true,
    useUnifiedTopology: true,
  });
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};
