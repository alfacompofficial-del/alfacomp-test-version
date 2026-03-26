import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { Button } from "@/components/ui/button";
import { Download as DownloadIcon, Monitor, Laptop } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartModal from "@/components/store/CartModal";

const Download = () => {
  const cart = useCart();
  const handleDownload = () => {
    window.location.href = "/AlfaComp-Windows.zip";
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <Header cartCount={cart.count} onCartClick={() => cart.setIsOpen(true)} />
      <main className="container mx-auto px-4 py-20 flex flex-col items-center">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Скачайте AlfaComp для Windows
          </h1>
          <p className="text-xl text-gray-400">
            Оформите рабочее место правильно. Наше приложение для ПК — это самый быстрый способ выбирать лучшие товары.
          </p>
          
          <div className="bg-[#16213e] p-8 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10">
            <div className="flex justify-center mb-6">
              <Monitor className="w-20 h-20 text-blue-400 opacity-80" />
            </div>
            
            <ul className="text-left space-y-4 mb-8 text-gray-300">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Мгновенный доступ с рабочего стола
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Удобный интерфейс без вкладок браузера
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Быстрые уведомления о новых поступлениях
              </li>
            </ul>

            <Button 
              onClick={handleDownload}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              <DownloadIcon className="mr-2 h-5 w-5" />
              Скачать (AlfaComp-Windows.zip)
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 italic">
            Распакуйте архив и запустите AlfaComp.exe для начала использования.
          </p>
        </div>
      </main>
      <Footer />
      <CartModal
        isOpen={cart.isOpen}
        onClose={() => cart.setIsOpen(false)}
        items={cart.items}
        total={cart.total}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onClear={cart.clearCart}
      />
    </div>
  );
};

export default Download;
