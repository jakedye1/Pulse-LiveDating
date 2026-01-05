# Pulse Backend Integration Guide

**Status:** Frontend Complete (Mock Services)  
**Goal:** Connect real backend APIs by replacing mock service implementations.  

---

## 1. Overview

Pulse is an iOS-first social discovery and dating app built with React Native (Expo). The frontend is fully implemented with a clear separation of concerns, using a service layer to handle all data operations.

Currently, the app runs on **mock data** simulated within the service files. Your task is to implement the real backend logic inside these service files, connecting the polished UI to your API.

---

## 2. Architecture Summary

The app follows a strict **Service-Repository pattern**.

- **Screens (`app/`)**: UI only. They never call APIs directly. They call Hooks or Contexts.
- **Contexts (`context/`)**: Global state management (Auth, AppMode). They call Services.
- **Services (`services/`)**: **THE ONLY PLACE FOR BACKEND CODE.** This is where you work.
- **Models (`domain/`)**: TypeScript interfaces defining the data shape.

**The Golden Rule:**  
> Never write API calls inside a screen or component.  
> Always implement them in `services/<feature>.ts` and call that service.

---

## 3. Folder Map

```
/
├── app/                  # Screens & Navigation (Expo Router)
├── components/           # Reusable UI components
├── context/              # Global State (AuthContext, AppModeContext)
├── services/             # <--- YOUR WORKSPACE (API implementations)
│   ├── auth.ts           # Authentication logic
│   ├── user.ts           # User profile & photo management
│   ├── match.ts          # Dating feed & interactions
│   ├── chat.ts           # Messaging logic
│   └── ...
├── domain/               # Data Models (types.ts)
├── config/               # Environment variables
└── constants/            # Colors, Layout, Typography
```

**Where to start:**  
Open `services/auth.ts`. You will see `signIn`, `signUp` methods returning mock data. Replace them with real API calls.

---

## 4. Environment Setup

The app uses `config/env.ts` to manage environment variables.

1.  **Create `.env` file** (if not exists):
    ```env
    EXPO_PUBLIC_API_BASE_URL=https://api.pulse-app.com/v1
    EXPO_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    EXPO_PUBLIC_REVENUECAT_KEY=appl_...
    ```

2.  **Access in code:**
    Do not use `process.env` directly. Use the helper:
    ```typescript
    import { Env } from '@/config/env';
    
    console.log(Env.API_BASE_URL);
    ```

---

## 5. Data Models (Single Source of Truth)

All models are defined in `domain/types.ts`.  
Key entities you must respect:

-   **`User`**: The central object. Includes `verification_status`, `onboarding_complete`, etc.
-   **`PrivacySettings`**: Boolean flags for visibility.
-   **`NotificationSettings`**: Boolean flags for push prefs.
-   **`Match`**: Represents a connection between two users.

**Critical Fields:**
-   `verification_status`: `'unverified' | 'pending' | 'verified' | 'rejected'`
-   `subscription_status`: `'free' | 'active'`
-   `onboarding_complete`: `boolean`

---

## 6. Routing & State Logic

The app determines where to send the user based on flags in the `User` object (handled in `context/AuthContext.tsx`).

| Condition | Route |
| :--- | :--- |
| `user == null` | `login` / `create-account` |
| `user != null` && `!onboarding_complete` | `onboarding` |
| `user != null` && `onboarding_complete` | `(tabs)/home` |

**Persisting State:**
The `AuthContext` handles session persistence via `AsyncStorage`.
When you implement `AuthService.getSession()`, ensure it returns the fresh `User` object from your backend to keep the app in sync.

---

## 7. Service Integration Checklist

Replace the mock code in `services/` with your backend client SDK or fetch calls.

### A. AuthService (`services/auth.ts`)
| Method | Inputs | Expected Output | Notes |
| :--- | :--- | :--- | :--- |
| `signUp` | `email`, `password`, `name` | `ServiceResponse<User>` | Create auth user + db record |
| `signIn` | `email`, `password` | `ServiceResponse<User>` | Return full user profile |
| `signOut` | None | `void` | Clear tokens |
| `getSession` | None | `ServiceResponse<User>` | Validate token & fetch fresh user |
| `resetPassword` | `email` | `ServiceResponse<void>` | Trigger password reset email |

### B. UserService (`services/user.ts`)
| Method | Inputs | Expected Output | Notes |
| :--- | :--- | :--- | :--- |
| `getMe` | None | `ServiceResponse<User>` | Get current user details |
| `updateProfile` | `Partial<User>` | `ServiceResponse<User>` | Patch updates |
| `uploadPhoto` | `File` / `Blob` | `ServiceResponse<string>` | Return public URL |
| `deletePhoto` | `photoId` | `ServiceResponse<void>` | Remove from array/db |
| `reorderPhotos` | `photoIds[]` | `ServiceResponse<User>` | Update order |

### C. MatchService (`services/match.ts`)
| Method | Inputs | Expected Output | Notes |
| :--- | :--- | :--- | :--- |
| `getDeck` | `filters` | `ServiceResponse<User[]>` | Recommendation algorithm |
| `like` | `userId` | `ServiceResponse<boolean>` | Returns `true` if matched |
| `pass` | `userId` | `ServiceResponse<void>` | Record pass |
| `getMatches` | None | `ServiceResponse<Match[]>` | List matches |

### D. FriendsService (`services/friends.ts` - *Create if missing*)
| Method | Inputs | Expected Output | Notes |
| :--- | :--- | :--- | :--- |
| `getFriends` | None | `ServiceResponse<User[]>` | List confirmed friends |
| `addFriend` | `userId` | `ServiceResponse<void>` | Send request |

### E. SubscriptionService (`services/subscription.ts` - *Create if missing*)
| Method | Inputs | Expected Output | Notes |
| :--- | :--- | :--- | :--- |
| `getPlans` | None | `ServiceResponse<Plan[]>` | Fetch RevenueCat/Stripe offerings |
| `purchase` | `planId` | `ServiceResponse<User>` | Execute purchase |
| `restorePurchases` | None | `ServiceResponse<User>` | Restore IAP |
| `getEntitlements` | None | `ServiceResponse<Entitlements>` | Check status |

### F. VerificationService (`services/verification.ts` - *Create if missing*)
| Method | Inputs | Expected Output | Notes |
| :--- | :--- | :--- | :--- |
| `startVerification` | None | `ServiceResponse<string>` | Init session ID |
| `submitSelfie` | `file` | `ServiceResponse<void>` | Upload selfie |
| `submitLiveness` | `payload` | `ServiceResponse<void>` | Send vendor payload |
| `submit` | None | `ServiceResponse<void>` | Finalize submission |
| `getStatus` | None | `ServiceResponse<string>` | Polling status |

---

## 8. Backend Recommendations

-   **Database**: Postgres (Supabase recommended for speed).
-   **Auth**: Supabase Auth or Firebase Auth.
-   **Storage**: Use an S3-compatible provider for photos.
    -   Bucket: `user-photos`
    -   Path: `/{userId}/{timestamp}.jpg`
-   **Realtime**: Needed for Chat and WebRTC signaling.
-   **Verification**: Consider integration with providers like Persona, Stripe Identity, or FaceTec.

---

## 9. Error Handling Standard

All services return a `ServiceResponse<T>` wrapper:

```typescript
export type ServiceResponse<T> = {
  data: T | null;
  error: { message: string; code?: string } | null;
};
```

**Pattern:**
1.  Catch SDK errors.
2.  Map them to readable messages.
3.  Return `{ data: null, error: { message: "Invalid password" } }`.
4.  UI automatically displays the error in a Toast or Alert.

**Common Codes:**
-   `AUTH_INVALID_CREDENTIALS`
-   `AUTH_EMAIL_IN_USE`
-   `NETWORK_ERROR`
-   `PERMISSION_DENIED`
-   `VALIDATION_ERROR`

---

## 10. Testing & QA Checklist

After connecting a service, verify:

-   [ ] **Login/Signup**: Can create a new user and it persists after restart?
-   [ ] **Onboarding**: Does completing onboarding update `onboarding_complete` to `true`?
-   [ ] **Photos**: Can you upload a photo and see it on your profile?
-   [ ] **Edit Profile**: Do changes to bio/interests save?
-   [ ] **Matches**: Can you like/pass and see matches appear?
-   [ ] **Logout**: Does it clear the session and return to login screen?

---

## 11. Day 1 Integration Plan

1.  **Setup Environment**: Configure API keys in `.env`.
2.  **Auth First**: Implement `AuthService`. Getting a token is prerequisite for everything else.
3.  **User Profile**: Implement `UserService.getMe` and `updateProfile`.
4.  **Photo Upload**: This is critical for the "Add Photos" step.
5.  **Everything Else**: Match feed, Chat, Settings.

---

## 12. Appendix: API Shape Examples

**`GET /me` Response:**
```json
{
  "id": "user_123",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "onboarding_complete": true,
  "verification_status": "verified",
  "photos": ["https://img.url/1.jpg", "https://img.url/2.jpg"],
  "privacy_settings": {
    "public_profile": true
  }
}
```

**`POST /update-profile` Payload:**
```json
{
  "bio": "New bio text",
  "interests": ["Travel", "Sushi"]
}
```
