import { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Product } from "@/hooks/useProducts";

interface CatalogSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const CatalogSection = ({ products, onAddToCart }: CatalogSectionProps) => {
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["all", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    return filter === "all" ? products : products.filter((p) => p.category === filter);
  }, [products, filter]);

  const displayed = showAll ? filtered : filtered.slice(0, 12);

  return (
    <section id="catalog" className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-[2px] text-primary">Каталог</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-gradient">Все товары</h2>
          <p className="text-muted-foreground mt-2">Актуальные цены в сумах и долларах</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setShowAll(false); }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "glass glass-hover"
                }`}
              >
                {cat === "all" ? "Все" : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:rotate-90 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-sm text-muted-foreground">
              Найдено: <span className="text-primary font-bold">{filtered.length}</span>
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>

        {filtered.length > 12 && !showAll && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="glass glass-hover rounded-full px-8 py-3 font-semibold text-sm hover:border-primary transition-all"
            >
              Показать ещё ({filtered.length - 12})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogSection;
