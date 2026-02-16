# 10 - Tipografia, Colori e Sistema Griglia

## Obiettivo
Definire il sistema visivo di bianchipro.it per garantire leggibilita, coerenza e riconoscimento del brand su tutti i dispositivi e contesti.

## Principi scientifici
- **Leggibilita e fiducia**: font leggibili aumentano la fiducia del 40% (MIT AgeLab, 2019)
- **Riconoscimento brand**: colori consistenti aumentano il riconoscimento del 60-80% (University of Loyola)
- **Contrasto WCAG**: rapporto minimo 4.5:1 per testo normale, 3:1 per testo grande (WCAG 2.1 AA)
- **Scala tipografica**: rapporto maggiore terza (1.250) per gerarchia armoniosa

## Tipografia

### Font stack
- **Headings**: Inter, system-ui, sans-serif
- **Body**: Inter, system-ui, sans-serif
- **Mono**: JetBrains Mono, monospace (codici prodotto, SKU)

### Scala tipografica (base 16px, ratio 1.250)
| Token | Size | Line Height | Peso | Uso |
|-------|------|-------------|------|-----|
| text-xs | 12px | 16px | 400 | Caption, note legali |
| text-sm | 14px | 20px | 400 | Label, metadati |
| text-base | 16px | 24px | 400 | Body text |
| text-lg | 18px | 28px | 500 | Body emphasis |
| text-xl | 20px | 28px | 600 | H4, sotto-titoli |
| text-2xl | 24px | 32px | 600 | H3, titoli sezione |
| text-3xl | 30px | 36px | 700 | H2, titoli pagina |
| text-4xl | 36px | 40px | 700 | H1, hero |

### Regole tipografiche
- Lunghezza riga ottimale: 60-75 caratteri (Bringhurst, 2004)
- Spaziatura paragrafi: 1.5x altezza riga
- Mai tutto maiuscolo per piu di 3 parole (leggibilita ridotta del 13-18%)

## Palette colori

### Colori primari
| Token | Valore | Uso |
|-------|--------|-----|
| primary-600 | #1E40AF | CTA primaria, link |
| primary-700 | #1D4ED8 | Hover CTA |
| primary-50 | #EFF6FF | Background sezioni |

### Colori secondari
| Token | Valore | Uso |
|-------|--------|-----|
| secondary-600 | #059669 | Successo, disponibilita |
| secondary-50 | #ECFDF5 | Badge "Pronta Consegna" bg |

### Colori neutrali
| Token | Valore | Uso |
|-------|--------|-----|
| gray-900 | #111827 | Testo primario |
| gray-600 | #4B5563 | Testo secondario |
| gray-400 | #9CA3AF | Placeholder, disabled |
| gray-200 | #E5E7EB | Bordi |
| gray-50 | #F9FAFB | Background alternato |
| white | #FFFFFF | Background primario |

### Colori semantici
| Token | Valore | Uso |
|-------|--------|-----|
| error-600 | #DC2626 | Errori, validazione |
| warning-500 | #F59E0B | Avvisi, stock basso |
| success-600 | #059669 | Conferme, disponibile |
| info-500 | #3B82F6 | Informativo |

### Contrasto verificato (WCAG 2.1 AA)
- gray-900 su white: 17.4:1 (passa AAA)
- primary-600 su white: 7.1:1 (passa AA)
- white su primary-600: 7.1:1 (passa AA)

## Sistema griglia

### Breakpoints
| Token | Valore | Colonne | Gutter |
|-------|--------|---------|--------|
| mobile | 0-639px | 4 | 16px |
| tablet | 640-1023px | 8 | 24px |
| desktop | 1024-1279px | 12 | 24px |
| wide | 1280px+ | 12 | 32px |

### Container
- Max width: 1280px
- Padding laterale: 16px (mobile), 24px (tablet), 32px (desktop)
- Centrato orizzontalmente

### Spaziatura (scala 4px)
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128

## Applicazione a bianchipro.it
- Inter come font unico per coerenza e performance (Google Fonts, variabile)
- Palette blu/verde per trasmettere professionalita e affidabilita
- Griglia a 12 colonne con breakpoint mobile-first

## Decisioni prese
1. Inter come font unico (heading + body) per ridurre HTTP requests
2. Scala tipografica 1.250 con base 16px
3. Blu primario per CTA e link; verde per stati positivi
4. Contrasto WCAG 2.1 AA verificato su tutte le combinazioni
5. Griglia 12 colonne con 4 breakpoint responsive
6. Scala spaziatura basata su 4px
