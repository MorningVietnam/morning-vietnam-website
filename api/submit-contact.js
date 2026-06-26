export const config = { runtime: 'edge' };

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

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS });
  }

  try {
    const body = await req.json();
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

    fields['Trạng thái'] = 'New';
    fields['Ngày booking'] = Date.now();

    const token = await getToken();
    const res = await fetch(`${LARK_API}/open-apis/bitable/v1/apps/${BASE_ID}/tables/${TABLE_ID}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ fields }),
    });
    const result = await res.json();
    if (result.code !== 0) throw new Error(JSON.stringify(result));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
}
