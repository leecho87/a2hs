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
  const [isStorage, setIsStorage] = useState(JSON.stringify(localStorage.getItem("TEST") || null));
  const [isApp, setIsApp] = useState(false);

  const handleSave = () => {
    localStorage.setItem("TEST", "로컬스토리지에 테스트 값을 저장합니다.");
    setIsStorage(JSON.stringify(localStorage.getItem("TEST")));
  }

  const handleDelete = () => {
    localStorage.removeItem("TEST");
    setIsStorage(null);
  };

  const handleNewBrowser = () => {
    var useragt = navigator.userAgent.toLowerCase();
		var target_url = window.location.href;
    target_url = target_url.replace(/\/$/, "");
    target_url = `${target_url}?testParam=abcdef`;
    alert(target_url)

    if(useragt.match(/kakaotalk/i)){
			//카카오톡 외부브라우저로 호출
			window.location.href = 'kakaotalk://web/openExternal?url='+encodeURIComponent(target_url);
    } else {
      window.location.href='intent://'+target_url.replace(/https?:\/\//i,'')+'#Intent;scheme=http;package=com.android.chrome;end';
    }
  }

  useEffect(() => {
    const agent = navigator.userAgent.toLowerCase();

    if (agent.includes("kakao")) {
      setIsApp(true)
    } else {
      setIsApp(false);
    }
  }, [])

  return (
    <>
      <h1>load</h1>
      <button onClick={handleSave}>로컬스토리지에 데이터 저장</button>
      <button onClick={handleDelete}>로컬스토리지 값 삭제</button>
      <p>로컬스토리지 데이터: {isStorage ? isStorage : "값이 없습니다"}</p>
      <hr />
      <p>카카오인가요? {isApp ? "네" : "아뇨"}</p>
      {isApp && (
        <button onClick={handleNewBrowser}>새로운 브라우저로 열기</button>
      )}
      <hr />
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
