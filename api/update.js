export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');
  
  try {
    const { vacation, late } = JSON.parse(req.body);

    await fetch(`${process.env.KV_REST_API_URL}/set/vacation_count/${vacation}`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
    });

    await fetch(`${process.env.KV_REST_API_URL}/set/late_count/${late}`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
