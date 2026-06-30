export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(200).send('ok'); return; }

  const { name, score, total, pct, time, date, emoji, mistakes } = req.body;

  const TG_TOKEN = process.env.TG_BOT_TOKEN;
  const OWNER_CHAT_ID = process.env.OWNER_TG_ID || '847709370';

  if (!TG_TOKEN) {
    res.status(200).json({ ok: true, note: 'TG_BOT_TOKEN not set' });
    return;
  }

  let msg = `${emoji} *Результат теста*\n\n👤 *${name}*\n✅ ${score} из ${total} правильных (${pct}%)\n⏱ ${time}\n📅 ${date}`;

  if (mistakes && mistakes.length > 0) {
    msg += `\n\n❌ *Ошибки (${mistakes.length}):*`;
    mistakes.forEach((m, i) => {
      msg += `\n\n${i + 1}. ${m.q}\n✅ ${m.correct}\n❌ ${m.chosen}`;
    });
  } else {
    msg += '\n\n🎯 Все ответы верные!';
  }

  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: OWNER_CHAT_ID, text: msg, parse_mode: 'Markdown' })
    });
  } catch (e) {
    console.error('TG send error:', e);
  }

  res.status(200).json({ ok: true });
}
