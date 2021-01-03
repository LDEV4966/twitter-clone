import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null); // user info
  //useEffect 사용 하지 않을시에 firebase의 db를 동기화 시키기도 전에
  // const [isLoggedIn, setIsLoggedIn] 값을 인식한다. 이것이 아래 함수를 쓴 이유다
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []); // useEffect는 동기화라고 생각하자. 마운트,언마운트,props값 업데이트시 사용 됨.
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Twitter</footer>
    </>
  );
}

export default App;
