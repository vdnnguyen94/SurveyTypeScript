
interface User {
    username: string;
    password: string;
    
  }
const signin = async (user: User): Promise<any> => { 
  try {
    // Validation for username
    if (!user.username) {
      return { error: 'Username required' };
    }   
    // Validation for password
    if (user.password.length < 6) {
      return { error: 'Password has to contain 6 letters or numbers' };
    }
    const response = await fetch('/auth/signin/', { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(user)
    });
    return await response.json();
  } catch(err) {
    console.error(err);
    // Handle error appropriately
    throw err;
  }
};

const signout = async (): Promise<any> => { 
  try {
    const response = await fetch('/auth/signout/', { method: 'GET' });
    return await response.json();
  } catch(err) { 
    console.error(err);
    // Handle error appropriately
    throw err;
  } 
};

export { signin, signout };
