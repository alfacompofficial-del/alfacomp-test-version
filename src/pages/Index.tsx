import Header from "@/components/store/Header";
import HeroSection from "@/components/store/HeroSection";
import CatalogSection from "@/components/store/CatalogSection";
import FeaturesSection from "@/components/store/FeaturesSection";
import FAQSection from "@/components/store/FAQSection";
import Footer from "@/components/store/Footer";
import CartModal from "@/components/store/CartModal";
import AIChatWidget from "@/components/store/AIChatWidget";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  const cart = useCart();
  const { data: products = [], isLoading } = useProducts();

  useVisitorTracking();

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={cart.count} onCartClick={() => cart.setIsOpen(true)} />
      <HeroSection />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <CatalogSection
          products={products}
          onAddToCart={(p) => cart.addItem({ id: p.id, name: p.name, price: p.price, image: p.image })}
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
