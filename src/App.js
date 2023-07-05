import React, { useState, useEffect } from "react";

const useA2HS = () => {
  /**
   * prompt가 실행될 수 있는 환경인 경우에만 모달창을 나타내기 위해
   * 변경 시 리렌더링을 발생시키기 위해서 useRef가 아닌 useState를 사용하였습니다.
   */
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    // beforeinstallprompt에 이벤트 핸들러를 등록합니다.
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = () => {
    // 설치 메서드 실행
    deferredPrompt?.prompt();
    deferredPrompt?.userChoice.then((choiceResult) => {
      clearPrompt();
    });
  };

  const clearPrompt = () => {
    setDeferredPrompt(null);
  };

  return { deferredPrompt, installApp, clearPrompt };
};

const App = () => {
  const { deferredPrompt, installApp, clearPrompt } = useA2HS();

  return (
    <>
      <h1>load</h1>
      {deferredPrompt ? (
        <div>
          <button onClick={clearPrompt}>취소</button>
          <button onClick={installApp}>홈 화면에 추가</button>
        </div>
      ) : (
        <>{JSON.stringify(deferredPrompt)}</>
      )}
    </>
  );
};

export default App;
