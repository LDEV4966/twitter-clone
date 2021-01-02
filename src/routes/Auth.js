import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const [socialLoginError, setSocialLoginError] = useState("");
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    let data;
    event.preventDefault();
    try {
      if (newAccount) {
        //create account
        // 두 method 모두 Promise 로 반환이기에 await를 사용해야함.
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => {
    setNewAccount(() => !newAccount);
  };
  const socialLogin = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    try {
      await authService.signInWithPopup(provider);
    }catch(error){
      setSocialLoginError(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "sign In"}
        />
        {error}
      </form>
      <span onClick={toggleAccount}>
        <button>{newAccount ? "Sign in" : "Create Account"}</button>
      </span>
      <div>
        <button onClick={socialLogin} name="google">
          Continue with Google
        </button>
        <button onClick={socialLogin} name="github">
          Continue with Github
        </button>
        {socialLoginError}
      </div>
    </div>
  );
};

export default Auth;
