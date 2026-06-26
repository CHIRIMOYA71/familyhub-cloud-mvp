import { createClient } from '@supabase/supabase-js';

function rid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function futureDate(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }
function defaultState() {
  return {
    familyName: '우리 가족',
    members: [{ id: 'mom', name: '엄마', lang: 'ko' }, { id: 'dad', name: '아빠', lang: 'es' }],
    heartNotes: [
      { id: rid(), from: 'dad', to: 'mom', text: '오늘도 고생했어. 말로 다 못 했지만 고마워.', translation: '', reactions: { '💛': 1 }, createdAt: Date.now() - 1000 * 60 * 30 },
      { id: rid(), from: 'mom', to: 'dad', text: '내일 아침은 내가 준비할게. 푹 자.', translation: '', reactions: {}, createdAt: Date.now() - 1000 * 60 * 60 * 8 }
    ],
    babyLogs: [
      { id: rid(), type: 'milk', memo: '120ml', by: 'mom', createdAt: Date.now() - 1000 * 60 * 180 },
      { id: rid(), type: 'nap', memo: '2시간', by: 'dad', createdAt: Date.now() - 1000 * 60 * 90 }
    ],
    tasks: [
      { id: rid(), text: '노아 예방접종 예약', by: 'dad', done: false, due: '' },
      { id: rid(), text: '기저귀 주문', by: 'mom', done: false, due: '' }
    ],
    shopping: [{ id: rid(), text: '분유', done: false }, { id: rid(), text: '계란', done: false }],
    events: [{ id: rid(), title: '소아과 검진', date: futureDate(5), by: 'family' }],
    documents: [{ id: rid(), title: '노아 여권', date: futureDate(45), by: 'family' }],
    updatedAt: Date.now()
  };
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function checkAuth(req) {
  const familyId = req.headers['x-family-id'] || req.query?.familyId;
  const familyPin = req.headers['x-family-pin'] || req.query?.familyPin;
  const allowedId = process.env.FAMILY_ID || 'woori-family';
  const allowedPin = process.env.FAMILY_PIN;
  if (!allowedPin) return { ok: false, error: 'missing_family_pin' };
  if (familyId !== allowedId || familyPin !== allowedPin) return { ok: false, error: 'unauthorized' };
  return { ok: true, familyId };
}

async function readOrCreate(supabase, familyId) {
  const { data, error } = await supabase.from('family_states').select('data,updated_at').eq('family_id', familyId).maybeSingle();
  if (error) throw error;
  if (data?.data) return data.data;
  const initial = defaultState();
  const { error: insertError } = await supabase.from('family_states').upsert({ family_id: familyId, data: initial, updated_at: new Date().toISOString() });
  if (insertError) throw insertError;
  return initial;
}

export default async function handler(req, res) {
  try {
    const auth = checkAuth(req);
    if (!auth.ok) return res.status(auth.error === 'unauthorized' ? 401 : 500).json({ error: auth.error });
    const supabase = getSupabase();
    if (!supabase) return res.status(500).json({ error: 'missing_supabase_env' });

    if (req.method === 'GET') {
      const state = await readOrCreate(supabase, auth.familyId);
      return res.status(200).json(state);
    }
    if (req.method === 'PUT') {
      const current = await readOrCreate(supabase, auth.familyId);
      const incoming = req.body || {};
      const next = { ...current, ...incoming, updatedAt: Date.now() };
      const { error } = await supabase.from('family_states').upsert({ family_id: auth.familyId, data: next, updated_at: new Date().toISOString() });
      if (error) throw error;
      return res.status(200).json(next);
    }
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (err) {
    return res.status(500).json({ error: 'server_error', detail: String(err?.message || err) });
  }
}
