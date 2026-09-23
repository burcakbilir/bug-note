export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  locale: string;
  savedTags: string[];
};

export type AuthResponse = {
  user: AuthUser;
};
