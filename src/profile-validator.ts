// This file contains a TypeScript type definition for a user profile, 
// along with some example user objects that demonstrate the use of optional properties and nested objects.
type UserProfile = {
  readonly id: number;
  username: string;
  settings?: {
    notifications?: boolean;
  };
};

// 1. User with notifications set
const userWithNotifications: UserProfile = {
  id: 1,
  username: "alice",
  settings: {
    notifications: true,
  },
};

// 2. User with no settings
const userWithoutSettings: UserProfile = {
  id: 2,
  username: "bob",
};

// 3. User with settings, but no notifications
const userWithoutNotifications: UserProfile = {
  id: 3,
  username: "charlie",
  settings: {},
};

// Safely checks notifications without crashing if settings or notifications is undefined
function isNotified(user: UserProfile): boolean {
  return user.settings?.notifications ?? false;
}

// verification
console.log(isNotified(userWithNotifications));    
console.log(isNotified(userWithoutSettings));      
console.log(isNotified(userWithoutNotifications)); 