function checkAuth(req) {
  const familyId = req.headers['x-family-id'];
  const familyPin = req.headers['x-family-pin'];
  if (!process.env.FAMILY_PIN) return { ok: false, error: 'missing_family_pin' };
  if (familyId !== (process.env.FAMILY_ID || 'woori-family') || familyPin !== process.env.FAMILY_PIN) return { ok: false, error: 'unauthorized' };
  return { ok: true };
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
    const auth = checkAuth(req);
    if (!auth.ok) return res.status(auth.error === 'unauthorized' ? 401 : 500).json({ error: auth.error });
    const { mode, text, tone = 'soft', targetLang = 'es' } = req.body || {};
    if (!text?.trim()) return res.status(400).json({ error: 'text_required' });
    if (!process.env.ANTHROPIC_API_KEY) return res.status(400).json({ error: 'missing_api_key' });

    const toneMap = {
      soft: '더 부드럽고 다정하게',
      thanks: '고마운 마음이 잘 느껴지게',
      ask: '부드럽게 부탁하는 말투로',
      calm: '서로 상하지 않게 차분하게',
      cheer: '따뜻하게 응원하는 말투로'
    };
    const langMap = { ko: '한국어', es: '스페인어', en: '영어' };
    const prompt = mode === 'translate'
      ? `다음 가족 메시지를 ${langMap[targetLang] || targetLang}로 자연스럽고 따뜻하게 번역해 주세요. 가족끼리 쓰는 말투로, 문화적으로 차갑거나 공격적으로 들리지 않게 다듬어 주세요. 번역문만 출력하세요.\n\n메시지: ${text}`
      : `아래 가족 메시지를 "${toneMap[tone] || toneMap.soft}" 느낌으로 다듬어 주세요. 원래 의미와 언어는 유지하고, 짧고 따뜻하고 가족이 쓰기 자연스럽게 만드세요. 설명 없이 문장만 출력하세요.\n\n메시지: ${text}`;

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-latest',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!anthropicRes.ok) return res.status(anthropicRes.status).json({ error: 'anthropic_error', detail: await anthropicRes.text() });
    const data = await anthropicRes.json();
    const result = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: 'server_error', detail: String(err?.message || err) });
  }
}
