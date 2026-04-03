import { useState } from 'react';
export default function ChatbotWidget({ context = '' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me about this destination or get travel tips.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      const reply = data?.reply || 'Sorry, I could not answer that.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, the assistant is unavailable right now.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border-2 border-soft-mint overflow-hidden mb-3">
          <div className="px-4 py-3 bg-gradient-to-r from-primary-dark to-dark-green text-white flex items-center justify-between">
            <span className="font-heading text-sm">Travel Assistant</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-xs font-body"
            >
              Close
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm font-body ${
                  m.role === 'user' ? 'text-primary-dark text-right' : 'text-dark-green'
                }`}
              >
                <span className="inline-block px-3 py-2 rounded-xl bg-background-mint">
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-xs text-dark-green">Thinking...</div>}
          </div>
          <div className="p-3 border-t border-soft-mint flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              className="flex-1 px-3 py-2 border-2 border-soft-mint rounded-full text-sm font-body"
              placeholder="Ask about this place..."
            />
            <button
              type="button"
              onClick={sendMessage}
              className="px-3 py-2 rounded-full bg-accent-green text-primary-dark text-xs font-button"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-3 rounded-full bg-accent-green text-primary-dark font-button shadow-lg"
      >
        Chat
      </button>
    </div>
  );
}
