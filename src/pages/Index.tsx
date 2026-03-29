tsx
import React, { useState, useEffect } from "react";
import Header from "@/components/store/Header";
import HeroSection from "@/components/store/HeroSection";
import CatalogSection from "@/components/store/CatalogSection";
import FeaturesSection from "@/components/store/FeaturesSection";
import FAQSection from "@/components/store/FAQSection";
import Footer from "@/components/store/Footer";
import CartModal from "@/components/store/CartModal";
import AIChatWidget from "@/components/store/AIChatWidget";
import { useCart } from "@/hooks/useCart";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

// ПОДКЛЮЧАЕМ FIREBASE
import { database } from "../firebaseConfig"; 
import { ref, onValue, increment, update } from "firebase/database";

const Index = () => {
  const cart = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Получаем живые товары из вашей админки в телефоне
  useEffect(() => {
    const productsRef = ref(database, 'products');
    
    // Слушаем изменения в базе "Билол"
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Преобразуем данные из Firebase в массив, который понимает CatalogSection
        const productList = Object.values(data).map((p: any) => ({
          id: p.id,
          name: p.name,
          // Используем цену в сумах как основную
          price: parseFloat(p.price_sum) || 0, 
          image: p.photo || "https://via.placeholder.com/300",
          category: p.category || "Все"
        }));
        
        // Новые товары (добавленные в админке последними) будут сверху
        setProducts(productList.reverse());
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Реальная статистика для вашей админки
  useEffect(() => {
    // При каждом заходе на сайт увеличиваем счетчик "Всего зашло" в админке
    const statsRef = ref(database, 'stats');
    update(statsRef, {
      total_devices: increment(1)
    });

    // Считаем "Кто в сети" (упрощенно)
    update(statsRef, {
      online_now: increment(1)
    });

    return () => {
      update(statsRef, {
        online_now: increment(-1)
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cartCount={cart.count} onCartClick={() => cart.setIsOpen(true)} />
      <HeroSection />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="ml-3 text-sm text-muted-foreground">Загрузка товаров из AlfaComp...</p>
        </div>
      ) : (
        <CatalogSection
          products={products}
          onAddToCart={(p) => cart.addItem({ 
            id: p.id, 
            name: p.name, 
            price: p.price, 
            image: p.image 
          })}
        />
      )}

      <FeaturesSection />
      <FAQSection />
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

      <AIChatWidget />
    </div>
  );
};

export default Index;
