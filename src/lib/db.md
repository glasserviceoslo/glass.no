import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

interface UserDoc {
  password: string;
  username: string;
}

interface SessionDoc {
  user_id: string;
  expires_at: Date;
}

const UserSchema = new mongoose.Schema<UserDoc>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: 'users' },
);

export const UserModel = mongoose.models.User || mongoose.model<UserDoc>('User', UserSchema);

export const SessionSchema = new mongoose.Schema<SessionDoc>(
  {
    user_id: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
  },
  { collection: 'sessions' },
);

export const SessionModel = mongoose.models.Session || mongoose.model<SessionDoc>('Session', SessionSchema);

export const adapter = new MongodbAdapter(
  // @ts-expect-error TODO: fix this
  mongoose.connection.collection<SessionDoc>('sessions'),
  mongoose.connection.collection<UserDoc>('users'),
);
