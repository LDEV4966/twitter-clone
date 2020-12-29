import React, { useState } from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser); 
  //true -> 로그인 성공, false -> 인증단계
  // useState는 react에서 받아온다. 위는 hooks 이다.
  return (
  <>
  <AppRouter isLoggedIn={isLoggedIn}/>
  <footer>&copy; {new Date().getFullYear()} Twitter</footer>
  </>
  );
}

export default App;
