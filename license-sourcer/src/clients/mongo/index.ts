import { MongoClient } from 'mongodb';

export const getClearlyDefinedDb = async () => {
    const mongoClient = new MongoClient(process.env.MONGO_CONNECTION_STRING!);

    try {
        await mongoClient.connect();

        console.log('Connected to ClearlyDefined DB');
    } catch (err) {
        throw new Error('Unable to connect to ClearlyDefined DB');
    }

    const db = mongoClient.db('clearlydefined');

    return { db, mongoClient };
};

export const closeDBConnection = async (mongoClient: MongoClient) => {
    await mongoClient.close();

    console.log('MongoDB connection closed');
};
