const APP_ID = 'cli_aab49c889bf85e17';
const APP_SECRET = 'WQ1WxnTll984gpZEuYlKbd1jCHpFgjXV';
const BASE_ID = 'OdUNbYniEa7qZFsHZAzjO1mLphb';
const TABLE_ID = 'tbl7EWLIrF0AFX1m';
const LARK_API = 'https://open.larksuite.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function getToken() {
  const res = await fetch(`${LARK_API}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.tenant_access_token;
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const fields = {};
    if (body.name)      fields['Tên KH'] = body.name;
    if (body.email)     fields['Contact KH'] = body.email;
    if (body.date) {
      const ms = new Date(body.date).getTime();
      if (!isNaN(ms)) fields['Ngày tour dự kiến'] = ms;
    }
    if (body.groupSize) {
      const n = parseInt(body.groupSize);
      if (!isNaN(n)) fields['Group size'] = n;
    }
    if (body.tour)      fields['Tour interest'] = body.tour;
    if (body.message)   fields['Mô tả tình trạng'] = body.message;
    if (body.source)    fields['Biết đến qua'] = body.source;
    if (body.duration)  fields['Duration'] = body.duration;
    if (body.pickup)    fields['Đi từ đâu'] = body.pickup;
    if (body.vehicle)   fields['Phương tiện'] = body.vehicle;
    fields['Trạng thái'] = 'New';
    fields['Ngày booking'] = Date.now();
    const token = await getToken();
    const larkRes = await fetch(`${LARK_API}/open-apis/bitable/v1/apps/${BASE_ID}/tables/${TABLE_ID}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ fields }),
    });
    const result = await larkRes.json();
    if (result.code !== 0) throw new Error(JSON.stringify(result));
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('submit-contact error:', e.message);
    return res.status(500).json({ success: false, error: e.message });
  }
}
