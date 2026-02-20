import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="app-page-shell py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="app-page-title text-2xl font-bold text-gray-900 mb-3">Il tuo carrello è vuoto</h1>
        <p className="app-page-subtitle text-gray-600 mb-8">Aggiungi prodotti al carrello per procedere all'acquisto.</p>
        <Link
          to="/"
          className="app-action-primary inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continua lo shopping
        </Link>
      </main>
    );
  }

  const totalNet = totalPrice;
  const totalVat = totalNet * 0.22;
  const totalGross = totalNet + totalVat;

  return (
    <main className="app-page-shell py-8 mb-20">
      <h1 className="app-page-title text-2xl font-bold text-gray-900 mb-8">Carrello ({items.length} {items.length === 1 ? 'prodotto' : 'prodotti'})</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                {item.options && (
                  <p className="text-xs text-gray-500 mt-1">{item.options.join(' • ')}</p>
                )}
                {item.accessories && item.accessories.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">+ {item.accessories.length} accessori</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">€ {(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600">
              <ArrowLeft className="w-4 h-4" /> Continua lo shopping
            </Link>
            <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700 font-medium">
              Svuota carrello
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Riepilogo Ordine</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotale (ex IVA)</span>
              <span className="font-medium">€ {totalNet.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA (22%)</span>
              <span className="font-medium">€ {totalVat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Spedizione</span>
              <span className="text-green-600 font-medium">Da calcolare</span>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between text-lg">
              <span className="font-bold text-gray-900">Totale (IVA incl.)</span>
              <span className="font-extrabold text-gray-900">€ {totalGross.toFixed(2)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="app-action-primary mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
          >
            Procedi al checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
