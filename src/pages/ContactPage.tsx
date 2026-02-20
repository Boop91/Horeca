/**
 * ContactPage.tsx — Pagina "Contattaci"
 *
 * Mostra tutte le informazioni di contatto reali di BianchiPro:
 * - Telefono, WhatsApp, email, sede fisica, orari
 * - Form di contatto con selezione dell'oggetto (preventivo, assistenza, ecc.)
 * - Dati aziendali (ragione sociale, P.IVA)
 * - Informazione sul ritiro in sede
 *
 * Dati reali estratti da bianchipro.it:
 * Sede: Via Giordano Bruno 10, 47822 Santarcangelo di Romagna (RN)
 * Tel: +39 0541 620526 | Email: clienti@bianchipro.it
 *
 * Rotta: /contatti
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { trackUxEvent } from '../lib/uxTelemetry';

type ContactField = 'fullName' | 'email' | 'subject' | 'message';
type ContactErrors = Partial<Record<ContactField, string>>;

const SUBJECT_VALUES = ['preventivo', 'info-prodotto', 'assistenza', 'ricambi', 'spedizione', 'altro'] as const;
const SUBJECT_SET = new Set<string>(SUBJECT_VALUES);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeSubject(value: string) {
  return SUBJECT_SET.has(value) ? value : '';
}

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const requestedSubject = searchParams.get('oggetto')?.trim() || '';
  const requestedCategory = searchParams.get('categoria')?.trim() || '';
  const requestedMessage = searchParams.get('messaggio')?.trim() || '';
  const normalizedRequestedSubject = useMemo(() => normalizeSubject(requestedSubject), [requestedSubject]);
  const initialMessage = useMemo(() => {
    if (requestedMessage) return requestedMessage;
    if (!requestedCategory) return '';
    return `Buongiorno, desidero un preventivo per la categoria "${requestedCategory}".`;
  }, [requestedCategory, requestedMessage]);

  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(normalizedRequestedSubject);
  const [message, setMessage] = useState(initialMessage);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubject(normalizedRequestedSubject);
    setMessage(initialMessage);
    setErrors({});
    setSubmitSuccess(false);
  }, [initialMessage, normalizedRequestedSubject]);

  useEffect(() => {
    if (!requestedCategory && !requestedSubject && !requestedMessage) return;
    trackUxEvent('contact_prefill_view', {
      category: requestedCategory || undefined,
      subject: requestedSubject || undefined,
      hasCustomMessage: Boolean(requestedMessage),
    });
  }, [requestedCategory, requestedMessage, requestedSubject]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitSuccess(false);

    const nextErrors: ContactErrors = {};
    if (fullName.trim().length < 2) {
      nextErrors.fullName = 'Inserisci nome e cognome (minimo 2 caratteri).';
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Inserisci un indirizzo email valido.';
    }
    if (!subject) {
      nextErrors.subject = "Seleziona l'oggetto della richiesta.";
    }
    if (message.trim().length < 10) {
      nextErrors.message = 'Inserisci un messaggio di almeno 10 caratteri.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      trackUxEvent('contact_submit_error', {
        errorFields: Object.keys(nextErrors),
        categoryPrefill: requestedCategory || undefined,
      });
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    trackUxEvent('contact_submit_success', {
      subject,
      categoryPrefill: requestedCategory || undefined,
      hasCompany: company.trim().length > 0,
      hasPhone: phone.trim().length > 0,
    });
    setSubmitSuccess(true);
  };

  const clearFieldError = (field: ContactField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return (
    <main className="app-page-shell py-8 mb-20">
      <h1 className="app-page-title text-3xl font-extrabold text-gray-900 mb-3">Contattaci</h1>
      <p className="app-page-subtitle text-lg text-gray-600 mb-8">
        Siamo a tua disposizione per consulenze, preventivi personalizzati e assistenza post-vendita.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Phone, title: 'Telefono', content: '+39 0541 620526', desc: 'Lun-Ven 8:30-18:00, Sab 9:00-13:00' },
            { icon: MessageCircle, title: 'WhatsApp', content: '+39 0541 620526', desc: 'Scrivici su WhatsApp per risposte rapide' },
            { icon: Mail, title: 'Email', content: 'clienti@bianchipro.it', desc: 'Rispondiamo entro 24 ore lavorative' },
            { icon: MapPin, title: 'Sede e Punto Vendita', content: 'Via Giordano Bruno 10', desc: '47822 Santarcangelo di Romagna (Rimini)' },
            { icon: Clock, title: 'Orari', content: 'Lun-Ven 8:30-18:00', desc: 'Sabato 9:00-13:00 — Ritiro merce disponibile' },
          ].map(({ icon: Icon, title, content, desc }) => (
            <div key={title} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="text-gray-700">{content}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}

          <div className="bg-green-50 rounded-xl border border-green-200 p-5 mt-4">
            <h3 className="font-bold text-green-900 mb-2">Ritiro in sede</h3>
            <p className="text-sm text-green-700">
              Puoi ritirare personalmente la maggior parte dei prodotti presso il nostro punto vendita
              a Santarcangelo di Romagna. Versando un acconto anticipato come prenotazione,
              potrai effettuare il saldo al momento del ritiro.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Inviaci un messaggio</h2>
            {requestedCategory && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Richiesta preventivo precompilata per: <strong>{requestedCategory}</strong>
              </div>
            )}
            {submitSuccess && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
                Richiesta acquisita correttamente. Ti ricontatteremo entro 24 ore lavorative.
              </div>
            )}
            {Object.keys(errors).length > 0 && (
              <div
                ref={errorSummaryRef}
                tabIndex={-1}
                role="alert"
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                Controlla i campi evidenziati e riprova.
              </div>
            )}
            <form className="space-y-4" noValidate onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-full-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome e Cognome <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-full-name"
                    type="text"
                    value={fullName}
                    required
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'contact-full-name-error' : undefined}
                    onChange={(event) => {
                      setFullName(event.target.value);
                      setSubmitSuccess(false);
                      clearFieldError('fullName');
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  />
                  {errors.fullName && (
                    <p id="contact-full-name-error" className="mt-1 text-sm text-red-700">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-company" className="block text-sm font-medium text-gray-700 mb-1">Azienda</label>
                  <input
                    id="contact-company"
                    type="text"
                    value={company}
                    onChange={(event) => {
                      setCompany(event.target.value);
                      setSubmitSuccess(false);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : 'contact-email-help'}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setSubmitSuccess(false);
                      clearFieldError('email');
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  />
                  {!errors.email && (
                    <p id="contact-email-help" className="mt-1 text-xs text-gray-500">
                      Useremo questa email per inviarti la risposta.
                    </p>
                  )}
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1 text-sm text-red-700">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setSubmitSuccess(false);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Oggetto <span aria-hidden="true">*</span>
                </label>
                <select
                  id="contact-subject"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  value={subject}
                  required
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  onChange={(event) => {
                    setSubject(event.target.value);
                    setSubmitSuccess(false);
                    clearFieldError('subject');
                  }}
                >
                  <option value="">Seleziona...</option>
                  <option value="preventivo">Richiesta preventivo</option>
                  <option value="info-prodotto">Informazioni prodotto</option>
                  <option value="assistenza">Assistenza post-vendita</option>
                  <option value="ricambi">Richiesta ricambi</option>
                  <option value="spedizione">Informazioni spedizione</option>
                  <option value="altro">Altro</option>
                </select>
                {errors.subject && (
                  <p id="contact-subject-error" className="mt-1 text-sm text-red-700">
                    {errors.subject}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Messaggio <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  value={message}
                  required
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setSubmitSuccess(false);
                    clearFieldError('message');
                  }}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1 text-sm text-red-700">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="app-action-primary w-full py-3 bg-green-700 text-white font-bold rounded-xl border border-green-900 shadow-sm hover:bg-green-800 transition-colors"
              >
                Invia messaggio
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-2">Dati aziendali</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-700">Ragione Sociale:</span> OMNIA SRL Unipersonale</p>
              <p><span className="font-medium text-gray-700">P.IVA:</span> IT03434940403</p>
              <p><span className="font-medium text-gray-700">Sede:</span> Via Giordano Bruno 10, 47822 Santarcangelo di Romagna (RN)</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
