import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const roleLabel = { mom: '엄마', dad: '아빠', family: '가족' };
const logTypes = {
  milk: '🍼 수유', meal: '🍚 식사', snack: '🍪 간식', nap: '💤 낮잠', diaper: '💧 기저귀', bath: '🛁 목욕', medicine: '💊 약'
};
const tones = [
  ['soft', '부드럽게'], ['thanks', '고마운 마음'], ['ask', '부탁조로'], ['calm', '안 싸우게'], ['cheer', '응원되게']
];

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function today() { return new Date().toISOString().slice(0, 10); }
function timeText(ts) { return new Date(ts).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
function dday(date) {
  const a = new Date(date + 'T00:00:00'); const b = new Date(); b.setHours(0,0,0,0);
  const diff = Math.round((a - b) / 86400000);
  if (diff === 0) return '오늘';
  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}
function authHeaders() {
  return {
    'content-type': 'application/json',
    'x-family-id': localStorage.getItem('familyhub.familyId') || import.meta.env.VITE_FAMILY_ID || 'woori-family',
    'x-family-pin': localStorage.getItem('familyhub.pin') || ''
  };
}
async function api(path, options = {}) {
  const res = await fetch(path, { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'api_error');
  return data;
}

function App() {
  const [state, setState] = useState(null);
  const [tab, setTab] = useState('home');
  const [me, setMe] = useState(localStorage.getItem('familyhub.me') || 'mom');
  const [status, setStatus] = useState('불러오는 중');
  const [dirty, setDirty] = useState(false);
  const [familyId, setFamilyId] = useState(localStorage.getItem('familyhub.familyId') || import.meta.env.VITE_FAMILY_ID || 'woori-family');
  const [familyPin, setFamilyPin] = useState(localStorage.getItem('familyhub.pin') || '');
  const [loginMsg, setLoginMsg] = useState('');
  const saveTimer = useRef(null);

  const loadState = async () => {
    setStatus('불러오는 중');
    try {
      const s = await api('/api/state');
      setState(s); setStatus('저장됨'); setLoginMsg('');
    } catch (e) {
      setState(null);
      setStatus('연결 실패');
      setLoginMsg(e.message === 'unauthorized' ? '가족 PIN이 맞지 않아요.' : '클라우드 서버 연결을 확인해 주세요.');
    }
  };

  useEffect(() => { if (familyPin) loadState(); }, []);

  useEffect(() => {
    if (!state || !dirty) return;
    clearTimeout(saveTimer.current);
    setStatus('저장 중...');
    saveTimer.current = setTimeout(async () => {
      try {
        const saved = await api('/api/state', { method: 'PUT', body: JSON.stringify(state) });
        setState(saved); setDirty(false); setStatus('저장됨');
      } catch { setStatus('저장 실패'); }
    }, 450);
    return () => clearTimeout(saveTimer.current);
  }, [state, dirty]);

  useEffect(() => {
    const id = setInterval(async () => {
      if (dirty) return;
      try {
        const server = await api('/api/state');
        setState(prev => (!prev || server.updatedAt > prev.updatedAt ? server : prev));
      } catch {}
    }, 2500);
    return () => clearInterval(id);
  }, [dirty]);

  const update = (fn) => setState(prev => { const next = typeof fn === 'function' ? fn(prev) : fn; setDirty(true); return { ...next, updatedAt: Date.now() }; });
  const other = me === 'mom' ? 'dad' : 'mom';

  if (!familyPin || !state) return <div className="screen">
    <header className="top"><div><div className="appname">FamTogether Cloud</div><h1>가족 앱 접속</h1><p>컴퓨터를 끄고도 쓰는 클라우드 버전</p></div></header>
    <main>
      <section className="card">
        <div className="cardHead"><h2>가족 공간 열기</h2></div>
        <p className="empty">처음 배포할 때 정한 FAMILY_ID와 FAMILY_PIN을 입력하세요. 엄마와 아빠가 같은 값을 넣으면 같은 데이터를 봅니다.</p>
        <input className="fullInput" value={familyId} onChange={e=>setFamilyId(e.target.value)} placeholder="가족 ID 예: woori-family" />
        <input className="fullInput" value={familyPin} onChange={e=>setFamilyPin(e.target.value)} placeholder="가족 PIN" type="password" />
        {loginMsg && <p className="empty" style={{color:'#e05f70'}}>{loginMsg}</p>}
        <button className="primary full" onClick={() => { localStorage.setItem('familyhub.familyId', familyId); localStorage.setItem('familyhub.pin', familyPin); loadState(); }}>접속하기</button>
      </section>
    </main>
  </div>;

  return <div className="screen">
    <header className="top">
      <div>
        <div className="appname">FamTogether MVP</div>
        <h1>{state.familyName}</h1>
        <p>{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
      </div>
      <div className="rolebox">
        {['mom','dad'].map(r => <button key={r} className={me===r?'active':''} onClick={() => { setMe(r); localStorage.setItem('familyhub.me', r); }}>{roleLabel[r]}</button>)}
      </div>
    </header>

    <main>
      <div className="status">● {status} · {me === 'mom' ? '엄마 화면' : '아빠 화면'} · 클라우드 저장 · 다른 폰은 2~3초 안에 반영</div>
      {tab === 'home' && <Home state={state} update={update} me={me} other={other} setTab={setTab} />}
      {tab === 'heart' && <Heart state={state} update={update} me={me} other={other} />}
      {tab === 'baby' && <Baby state={state} update={update} me={me} />}
      {tab === 'house' && <House state={state} update={update} me={me} />}
      {tab === 'cal' && <Calendar state={state} update={update} me={me} />}
    </main>

    <nav>
      {[['home','홈'],['heart','마음'],['baby','육아'],['house','살림'],['cal','일정']].map(([id,label]) => <button key={id} className={tab===id?'active':''} onClick={() => setTab(id)}>{label}</button>)}
    </nav>
  </div>;
}

function Card({ title, children, right }) { return <section className="card"><div className="cardHead"><h2>{title}</h2>{right}</div>{children}</section>; }
function Empty({ children }) { return <p className="empty">{children}</p>; }

function Home({ state, update, me, other, setTab }) {
  const latestHeart = [...state.heartNotes].sort((a,b)=>b.createdAt-a.createdAt).slice(0,2);
  const latestLog = [...state.babyLogs].sort((a,b)=>b.createdAt-a.createdAt).slice(0,3);
  const upcoming = [...state.events, ...state.documents.map(d => ({...d, isDoc:true}))].sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,4);
  return <div className="stack">
    <QuickHeart state={state} update={update} me={me} other={other} compact />
    <Card title="오늘의 마음한마디" right={<button className="link" onClick={()=>setTab('heart')}>전체</button>}>
      {latestHeart.length ? latestHeart.map(n => <Note key={n.id} n={n} update={update} />) : <Empty>아직 마음한마디가 없어요.</Empty>}
    </Card>
    <Card title="최근 육아 기록" right={<button className="link" onClick={()=>setTab('baby')}>기록</button>}>
      {latestLog.map(l => <div className="row" key={l.id}><b>{logTypes[l.type] || l.type}</b><span>{l.memo}</span><em>{timeText(l.createdAt)}</em></div>)}
    </Card>
    <Card title="다가오는 일정/문서" right={<button className="link" onClick={()=>setTab('cal')}>추가</button>}>
      {upcoming.map(x => <div className="row" key={(x.isDoc?'d':'e')+x.id}><b>{x.isDoc ? '📄 ' : '📌 '}{x.title}</b><span>{x.date}</span><em>{dday(x.date)}</em></div>)}
    </Card>
  </div>;
}

function Heart({ state, update, me, other }) {
  return <div className="stack">
    <QuickHeart state={state} update={update} me={me} other={other} />
    <Card title="마음한마디 기록">
      {[...state.heartNotes].sort((a,b)=>b.createdAt-a.createdAt).map(n => <Note key={n.id} n={n} update={update} editable />)}
    </Card>
  </div>;
}

function QuickHeart({ state, update, me, other, compact }) {
  const [text, setText] = useState('');
  const [to, setTo] = useState(other);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState('');
  const targetLang = to === 'dad' ? 'es' : 'ko';

  const send = () => {
    if (!text.trim()) return;
    update(s => ({...s, heartNotes: [{ id: uid(), from: me, to, text: text.trim(), translation: preview, reactions: {}, createdAt: Date.now() }, ...s.heartNotes]}));
    setText(''); setPreview('');
  };
  const ai = async (mode, tone='soft') => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const out = await api('/api/ai', { method:'POST', body: JSON.stringify({ mode, tone, text, targetLang }) });
      if (mode === 'translate') setPreview(out.result); else setText(out.result);
    } catch (e) {
      alert(e.message === 'missing_api_key' ? '서버 .env에 ANTHROPIC_API_KEY를 넣으면 AI 기능이 켜져요.' : 'AI 연결 실패');
    } finally { setBusy(false); }
  };
  return <Card title="💛 마음한마디" right={compact ? null : <span className="pill">{roleLabel[me]} 작성</span>}>
    <div className="toLine">받는 사람 {['mom','dad'].filter(x=>x!==me).map(r => <button key={r} className={to===r?'active chip':'chip'} onClick={()=>setTo(r)}>{roleLabel[r]}</button>)}</div>
    <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="짧아도 괜찮아요. 가족에게 하고 싶은 말을 남겨보세요." />
    <div className="toneLine">{tones.map(([id,label]) => <button key={id} disabled={busy} onClick={()=>ai('soften', id)}>{label}</button>)}</div>
    {preview && <div className="preview"><small>번역 미리보기</small>{preview}</div>}
    <div className="actions"><button onClick={()=>ai('translate')} disabled={busy}>번역 미리보기</button><button className="primary" onClick={send}>남기기</button></div>
  </Card>;
}

function Note({ n, update, editable }) {
  const react = (emoji) => update(s => ({...s, heartNotes: s.heartNotes.map(x => x.id===n.id ? {...x, reactions: {...x.reactions, [emoji]: (x.reactions?.[emoji]||0)+1}} : x)}));
  const del = () => update(s => ({...s, heartNotes: s.heartNotes.filter(x => x.id !== n.id)}));
  return <article className="note">
    <div className="meta"><span>{roleLabel[n.from]} → {roleLabel[n.to]}</span><em>{timeText(n.createdAt)}</em></div>
    <p>{n.text}</p>{n.translation && <blockquote>{n.translation}</blockquote>}
    <div className="reactions">{['💛','🙏','🥹','👏'].map(e => <button key={e} onClick={()=>react(e)}>{e} {n.reactions?.[e] || ''}</button>)}{editable && <button onClick={del}>삭제</button>}</div>
  </article>;
}

function Baby({ state, update, me }) {
  const [type, setType] = useState('milk'); const [memo, setMemo] = useState('');
  const add = () => { update(s => ({...s, babyLogs: [{id:uid(), type, memo, by:me, createdAt:Date.now()}, ...s.babyLogs]})); setMemo(''); };
  return <div className="stack"><Card title="육아 기록 추가">
    <div className="grid2"><select value={type} onChange={e=>setType(e.target.value)}>{Object.entries(logTypes).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><input value={memo} onChange={e=>setMemo(e.target.value)} placeholder="예: 120ml, 2시간, 많이 먹음" /></div><button className="primary full" onClick={add}>기록 추가</button>
  </Card><Card title="타임라인">{[...state.babyLogs].sort((a,b)=>b.createdAt-a.createdAt).map(l=><div className="row" key={l.id}><b>{logTypes[l.type]}</b><span>{l.memo || '-'}</span><em>{roleLabel[l.by]} · {timeText(l.createdAt)}</em></div>)}</Card></div>;
}

function House({ state, update, me }) {
  const [task, setTask] = useState(''); const [item, setItem] = useState('');
  const addTask = () => { if(task.trim()) { update(s=>({...s,tasks:[{id:uid(),text:task,by:me,done:false,due:''},...s.tasks]})); setTask(''); }};
  const addItem = () => { if(item.trim()) { update(s=>({...s,shopping:[{id:uid(),text:item,done:false},...s.shopping]})); setItem(''); }};
  const toggleTask = id => update(s=>({...s,tasks:s.tasks.map(x=>x.id===id?{...x,done:!x.done}:x)}));
  const toggleItem = id => update(s=>({...s,shopping:s.shopping.map(x=>x.id===id?{...x,done:!x.done}:x)}));
  return <div className="stack"><Card title="할 일"><div className="addline"><input value={task} onChange={e=>setTask(e.target.value)} placeholder="할 일 입력"/><button onClick={addTask}>추가</button></div>{state.tasks.map(t=><label className="checkrow" key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggleTask(t.id)}/><span>{t.text}</span><em>{roleLabel[t.by]}</em></label>)}</Card><Card title="장보기"><div className="addline"><input value={item} onChange={e=>setItem(e.target.value)} placeholder="살 것 입력"/><button onClick={addItem}>추가</button></div>{state.shopping.map(i=><label className="checkrow" key={i.id}><input type="checkbox" checked={i.done} onChange={()=>toggleItem(i.id)}/><span>{i.text}</span></label>)}</Card></div>;
}

function Calendar({ state, update, me }) {
  const [title, setTitle] = useState(''); const [date, setDate] = useState(today()); const [kind, setKind] = useState('event');
  const add = () => { if(!title.trim()) return; const key = kind === 'event' ? 'events' : 'documents'; update(s=>({...s,[key]:[{id:uid(),title,date,by:me},...s[key]]})); setTitle(''); };
  const list = useMemo(()=>[...state.events.map(x=>({...x,kind:'event'})),...state.documents.map(x=>({...x,kind:'doc'}))].sort((a,b)=>new Date(a.date)-new Date(b.date)),[state]);
  return <div className="stack"><Card title="일정/문서 추가"><div className="grid2"><select value={kind} onChange={e=>setKind(e.target.value)}><option value="event">일정</option><option value="doc">문서 만료</option></select><input type="date" value={date} onChange={e=>setDate(e.target.value)} /></div><input className="fullInput" value={title} onChange={e=>setTitle(e.target.value)} placeholder="예: 예방접종, 여권 만료"/><button className="primary full" onClick={add}>추가</button></Card><Card title="전체 일정/문서">{list.map(x=><div className="row" key={x.kind+x.id}><b>{x.kind==='doc'?'📄':'📌'} {x.title}</b><span>{x.date}</span><em>{dday(x.date)}</em></div>)}</Card></div>;
}

createRoot(document.getElementById('root')).render(<App />);
