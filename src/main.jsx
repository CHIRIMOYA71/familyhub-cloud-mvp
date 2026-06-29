import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FamilyHub from "./App.jsx";

const HEADER_GRAD = "linear-gradient(120deg,#5FC0BE,#79A6E2,#A38FD8)";
const TEAL = "#52B0B5";
const BG_PAGE = "#FBF6F0";

function authHeaders() {
  return {
    "content-type": "application/json",
    "x-family-id": localStorage.getItem("familyhub.familyId") || import.meta.env.VITE_FAMILY_ID || "woori-family",
    "x-family-pin": localStorage.getItem("familyhub.pin") || "",
  };
}
async function api(path, options = {}) {
  const res = await fetch(path, { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "api_error");
  return data;
}

// 서버 AI 함수 호출 (Claude). App.jsx가 props로 받아 사용.
async function aiCall({ mode, text, tone = "soft", targetLang = "es" }) {
  try {
    const out = await api("/api/ai", { method: "POST", body: JSON.stringify({ mode, text, tone, targetLang }) });
    return out.result || null;
  } catch (e) {
    return null;
  }
}

function Root() {
  const [state, setState] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | saved | saving | error
  const [familyId, setFamilyId] = useState(localStorage.getItem("familyhub.familyId") || import.meta.env.VITE_FAMILY_ID || "woori-family");
  const [familyPin, setFamilyPin] = useState(localStorage.getItem("familyhub.pin") || "");
  const [authed, setAuthed] = useState(!!localStorage.getItem("familyhub.pin"));
  const [loginMsg, setLoginMsg] = useState("");
  const dirtyRef = useRef(false);
  const saveTimer = useRef(null);
  const stateRef = useRef(null);
  stateRef.current = state;

  const loadState = async () => {
    setStatus("loading");
    try {
      const s = await api("/api/state");
      setState(s); setStatus("saved"); setLoginMsg(""); setAuthed(true);
    } catch (e) {
      setStatus("error");
      setLoginMsg(e.message === "unauthorized" ? "가족 PIN이 맞지 않아요." : "서버 연결을 확인해 주세요.");
      setAuthed(false);
    }
  };

  useEffect(() => { if (familyPin) loadState(); /* eslint-disable-next-line */ }, []);

  // App에서 데이터 변경 시 호출 → 디바운스 저장
  const update = (next) => {
    dirtyRef.current = true;
    setState((prev) => ({ ...(prev || {}), ...next, updatedAt: Date.now() }));
    setStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const saved = await api("/api/state", { method: "PUT", body: JSON.stringify(stateRef.current) });
        setState(saved); dirtyRef.current = false; setStatus("saved");
      } catch { setStatus("error"); }
    }, 500);
  };

  // 2.5초 폴링: 다른 폰 변경 반영 (내가 편집 중이 아닐 때만)
  useEffect(() => {
    if (!authed) return;
    const iv = setInterval(async () => {
      if (dirtyRef.current) return;
      try {
        const server = await api("/api/state");
        setState((prev) => (!prev || (server.updatedAt || 0) > (prev.updatedAt || 0) ? server : prev));
      } catch {}
    }, 2500);
    return () => clearInterval(iv);
  }, [authed]);

  // ---- 로그인 화면 ----
  if (!authed || !state) {
    return (
      <div className="fh-app min-h-screen flex justify-center" style={{ background: "#EDE6DD" }}>
        <div className="w-full max-w-md min-h-screen flex flex-col" style={{ background: BG_PAGE }}>
          <div className="text-white px-5 pt-8 pb-6" style={{ backgroundImage: HEADER_GRAD }}>
            <p className="text-xs opacity-90">NoaFam</p>
            <h1 className="text-xl font-bold ff-title mt-1">가족 공간 열기</h1>
            <p className="text-xs opacity-90 mt-1">컴퓨터를 꺼도 폰에서 함께 쓰는 클라우드 버전</p>
          </div>
          <div className="p-5 space-y-3">
            <div className="border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3" style={{ background: "#FFFDFB" }}>
              <p className="text-sm text-gray-500">처음 배포할 때 정한 가족 ID와 PIN을 입력하세요. 엄마·아빠가 같은 값을 넣으면 같은 데이터를 봅니다.</p>
              <input value={familyId} onChange={(e) => setFamilyId(e.target.value)} placeholder="가족 ID (예: woori-family)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-300" />
              <input value={familyPin} onChange={(e) => setFamilyPin(e.target.value)} placeholder="가족 PIN" type="password" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-300" />
              {loginMsg && <p className="text-xs text-rose-500">{loginMsg}</p>}
              <button onClick={() => { localStorage.setItem("familyhub.familyId", familyId); localStorage.setItem("familyhub.pin", familyPin); loadState(); }} className="w-full text-white rounded-xl py-3 font-bold ff-title active:scale-[0.99]" style={{ background: TEAL }}>접속하기</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <FamilyHub serverState={state} onUpdate={update} status={status} aiCall={aiCall} />;
}

createRoot(document.getElementById("root")).render(<Root />);
