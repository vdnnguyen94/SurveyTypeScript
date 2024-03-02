import { signout } from './api-auth';

// Define an interface for the User object
interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
}

// Define an interface for the JWT object
interface JWT {
  token: string;
  user: User;
}

// Define the AuthHelper interface
interface AuthHelper {
  isAuthenticated(): JWT | boolean;
  authenticate(jwt: JWT, cb: () => void): void;
  clearJWT(cb: () => void): void;
}

const auth: AuthHelper = {
  isAuthenticated(): JWT | boolean {
    if (typeof window === "undefined") return false;

    const jwtString = sessionStorage.getItem('jwt');
    if (jwtString) {
      return JSON.parse(jwtString);
    } else {
      return false;
    }
  },
  authenticate(jwt: JWT, cb: () => void): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem('jwt', JSON.stringify(jwt));
    }
    cb();
  },
  clearJWT(cb: () => void): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem('jwt');
      // Optional
      signout().then((data) => {
        document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      });
    }
    cb();
  }
};

export default auth;
