export type ProfileDto = Readonly<{
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  coverUrl: string | null;
  avatarUrl: string | null;
}>;
