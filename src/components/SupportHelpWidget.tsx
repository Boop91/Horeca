import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Headset, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { trackUxEvent } from '../lib/uxTelemetry';
import './SupportHelpWidget.css';

interface ChatMessage {
  id: string;
  from: 'assistant' | 'user';
  text: string;
}

function buildAssistantReply(input: string) {
  const normalized = input.toLowerCase();

  if (normalized.includes('ordine') || normalized.includes('spedizione')) {
    return 'Per ordini e spedizioni puoi controllare prima "Account > Storico Ordini". Se vuoi, ti guido passo passo.';
  }
  if (normalized.includes('fattura') || normalized.includes('sdi') || normalized.includes('pec')) {
    return 'Per fatture e dati fiscali vai in "Account > Profilo Azienda" o "Account > Fatture". Posso dirti esattamente dove cliccare.';
  }
  if (normalized.includes('pagamento') || normalized.includes('stripe') || normalized.includes('carta')) {
    return 'Per pagamenti usa "Account > Gestione Pagamenti". Da li puoi configurare le key Stripe e gestire le carte.';
  }
  if (normalized.includes('preventiv')) {
    return 'Per i preventivi apri "Account > Preventivi". Se serve, puoi anche inviare un messaggio veloce dal pulsante Aiuto.';
  }

  return 'Ti aiuto volentieri. Descrivi il problema in una frase e ti propongo subito il percorso piu veloce.';
}

export default function SupportHelpWidget() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'boot',
      from: 'assistant',
      text: 'Ciao, sono l\'assistente automatico. Ti aiuto con ordini, pagamenti, fatture e assistenza.',
    },
  ]);

  const quickLinks = useMemo(
    () => [
      {
        id: 'chat',
        label: 'Chat AI live',
        description: 'Assistenza automatica immediata',
      },
      {
        id: 'site-message',
        label: 'Messaggio veloce',
        description: 'Apri il form contatti precompilato',
        href: '/contatti?oggetto=assistenza&messaggio=Buongiorno,%20ho%20bisogno%20di%20supporto%20rapido.',
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        description: 'Scrivici direttamente in chat',
        href: 'https://wa.me/390541620526?text=Buongiorno,%20ho%20bisogno%20di%20supporto.',
      },
    ],
    [],
  );

  const submitChat = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, from: 'user', text };
    const assistantMsg: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      from: 'assistant',
      text: buildAssistantReply(text),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    trackUxEvent('help_chat_send', { messageLength: text.length });
  };

  return (
    <div
      className="support-help-widget group pointer-events-auto"
      data-testid="support-help-widget"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      {chatOpen && (
        <div className="support-help-chat-shell rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-green-700 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-white">Chat assistenza AI</p>
              <p className="text-xs text-green-100">Risposta automatica in tempo reale</p>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="support-help-chat-close rounded-full p-1 text-white/90 hover:bg-white/20"
              aria-label="Chiudi chat assistenza"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto p-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    message.from === 'user'
                      ? 'bg-green-700 text-white'
                      : 'border border-gray-200 bg-gray-50 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-gray-200 p-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitChat();
              }}
              placeholder="Scrivi il tuo problema..."
              className="h-11 flex-1 rounded-lg border border-gray-300 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            <button
              type="button"
              onClick={submitChat}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-green-700 text-white hover:bg-green-800"
              aria-label="Invia messaggio chat"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div
        className={`support-help-menu ${
          menuOpen ? 'support-help-menu-open' : 'support-help-menu-closed'
        }`}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Supporto rapido</p>
        <div className="space-y-2">
          {quickLinks.map((entry) =>
            entry.id === 'chat' ? (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setChatOpen(true);
                  setMenuOpen(false);
                  trackUxEvent('help_chat_open');
                }}
                className="support-help-option support-help-option-chat"
              >
                <div>
                  <p className="text-sm font-semibold text-green-900">{entry.label}</p>
                  <p className="text-xs text-green-700">{entry.description}</p>
                </div>
                <Sparkles className="h-4 w-4 text-green-700" />
              </button>
            ) : entry.href?.startsWith('http') ? (
              <a
                key={entry.id}
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackUxEvent('help_whatsapp_open')}
                className="support-help-option"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{entry.label}</p>
                  <p className="text-xs text-gray-600">{entry.description}</p>
                </div>
                <MessageCircle className="h-4 w-4 text-gray-700" />
              </a>
            ) : (
              <Link
                key={entry.id}
                to={entry.href || '/contatti'}
                onClick={() => trackUxEvent('help_quick_message_open')}
                className="support-help-option"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{entry.label}</p>
                  <p className="text-xs text-gray-600">{entry.description}</p>
                </div>
                <Send className="h-4 w-4 text-gray-700" />
              </Link>
            ),
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setMenuOpen((prev) => !prev);
          trackUxEvent('help_widget_open', { open: !menuOpen });
        }}
        className="support-help-trigger"
      >
        <span className="support-help-trigger-ring" aria-hidden="true" />
        <span className="support-help-trigger-content">
          <Headset className="h-4 w-4 text-white" />
          <span className="support-help-trigger-label">Aiuto</span>
        </span>
      </button>
    </div>
  );
}
