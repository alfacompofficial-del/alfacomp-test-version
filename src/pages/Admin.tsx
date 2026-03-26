import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Lock, Package, Plus, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { convertToUSD, ADMIN_PASSWORD, EXCHANGE_RATE, formatPrice } from "@/lib/constants";
import { useProducts } from "@/hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"stats" | "products" | "add">("stats");
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const { data: products = [] } = useProducts();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { urlPassword } = useParams<{ urlPassword: string }>();

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ИБП");
  const [addPosition, setAddPosition] = useState<"begin" | "end">("end");

  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
    priceSum: "",
    priceUsd: "",
  });

  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  type PriceEdit = { sum: string; usd: string };
  const [priceEdits, setPriceEdits] = useState<Record<number, PriceEdit>>({});

  const baseCategories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const categories = useMemo(() => {
    const merged = [...baseCategories, ...customCategories.filter((c) => !baseCategories.includes(c))];
    return merged;
  }, [baseCategories, customCategories]);

  useEffect(() => {
    if (!authenticated) return;

    const fetchStats = async () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: online } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true })
        .gte("last_seen", fiveMinAgo)
        .eq("is_online", true);

      const { count: total } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true });

      setOnlineCount(online || 0);
      setTotalVisitors(total || 0);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [authenticated]);

  useEffect(() => {
    const urlPassword = new URLSearchParams(window.location.search).get("password");
    if (urlPassword === ADMIN_PASSWORD) {
      setAuthenticated(true);
      return;
    }
  }, []);

  useEffect(() => {
    if (urlPassword === ADMIN_PASSWORD) setAuthenticated(true);
  }, [urlPassword]);

  useEffect(() => {
    if (!authenticated) return;
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [authenticated, categories, selectedCategory]);

  useEffect(() => {
    if (!authenticated) return;

    // Initialize price edit fields based on current products.
    const next: Record<number, PriceEdit> = {};
    for (const p of products) {
      next[p.id] = {
        sum: String(p.price),
        usd: String(convertToUSD(p.price)),
      };
    }
    setPriceEdits(next);
  }, [authenticated, products]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      toast.error("Неверный пароль!");
    }
  };

  const usdFromSum = (sum: number) => {
    if (!Number.isFinite(sum)) return 0;
    return Math.round(sum / EXCHANGE_RATE);
  };

  const sumFromUsd = (usd: number) => {
    if (!Number.isFinite(usd)) return 0;
    return Math.round(usd * EXCHANGE_RATE);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.priceSum || !newProduct.image || !selectedCategory) {
      toast.error("Заполните все поля!");
      return;
    }

    try {
      const priceSum = parseInt(newProduct.priceSum, 10);
      if (!Number.isFinite(priceSum)) {
        toast.error("Цена (сум) должна быть числом");
        return;
      }

      // Use created_at to simulate "add to beginning/end" inside a category.
      // Earlier created_at appears earlier when sorting by created_at ascending.
      const catProducts = products.filter((p) => p.category === selectedCategory);
      const timestamps = catProducts
        .map((p) => (p as any).created_at as string | undefined)
        .filter(Boolean)
        .map((t) => new Date(t as string).getTime())
        .filter((t) => Number.isFinite(t));

      const createdAt = (() => {
        if (timestamps.length === 0) return new Date();
        const min = Math.min(...timestamps);
        const max = Math.max(...timestamps);
        const deltaMs = 1; // minimal so it stays strictly before/after
        return addPosition === "begin"
          ? new Date(min - deltaMs)
          : new Date(max + deltaMs);
      })();

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "add",
          password: ADMIN_PASSWORD,
          product: {
            name: newProduct.name,
            category: selectedCategory,
            price: priceSum,
            image: newProduct.image,
            brand: "Generic",
            in_stock: true,
            created_at: createdAt.toISOString(),
          },
        }),
      });

      if (!resp.ok) throw new Error("Failed to add product");

      toast.success("Товар добавлен!");
      setNewProduct({ name: "", image: "", priceSum: "", priceUsd: "" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setTab("products");
    } catch {
      toast.error("Ошибка при добавлении товара");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: "delete", password: ADMIN_PASSWORD, productId: id }),
      });

      if (!resp.ok) throw new Error("Failed");
      toast.success("Товар удалён");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const handleUpdatePrice = async (id: number) => {
    const edit = priceEdits[id];
    if (!edit) return;

    const sum = parseInt(edit.sum, 10);
    if (!Number.isFinite(sum)) {
      toast.error("Цена (сум) должна быть числом");
      return;
    }

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "update",
          password: ADMIN_PASSWORD,
          productId: id,
          price: sum,
        }),
      });

      if (!resp.ok) throw new Error("Failed to update price");

      toast.success("Цена обновлена");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch {
      toast.error("Ошибка обновления цены");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 w-full max-w-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-center mb-6">Админ-панель</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm hover:scale-[1.02] transition-transform">
              Войти
            </button>
          </form>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-3 text-sm text-muted-foreground hover:text-primary text-center transition-colors"
          >
            ← Вернуться в магазин
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="glass rounded-lg w-9 h-9 flex items-center justify-center hover:border-primary transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-bold">📊 Админ-панель</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Онлайн: {onlineCount}
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Eye, label: "Онлайн сейчас", value: onlineCount, color: "text-green-400" },
            { icon: Users, label: "Всего устройств", value: totalVisitors, color: "text-primary" },
            { icon: Package, label: "Всего товаров", value: products.length, color: "text-accent" },
            { icon: Package, label: "Категорий", value: categories.length, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-5">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "stats" as const, label: "Статистика" },
            { id: "products" as const, label: "Товары" },
            { id: "add" as const, label: "Добавить товар" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "glass glass-hover"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "stats" && (
          <div className="space-y-4">
            <h3 className="font-bold">Статистика по категориям</h3>
            <div className="glass rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">Категория</th>
                      <th className="text-right p-4 font-semibold">Товаров</th>
                      <th className="text-right p-4 font-semibold hidden sm:table-cell">Мин. цена</th>
                      <th className="text-right p-4 font-semibold hidden sm:table-cell">Макс. цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => {
                      const catProducts = products.filter((p) => p.category === cat);
                      const min = Math.min(...catProducts.map((p) => p.price));
                      const max = Math.max(...catProducts.map((p) => p.price));
                      return (
                        <tr key={cat} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="p-4 font-medium">{cat}</td>
                          <td className="p-4 text-right text-primary font-bold">{catProducts.length}</td>
                          <td className="p-4 text-right hidden sm:table-cell">{formatPrice(min)} сум</td>
                          <td className="p-4 text-right hidden sm:table-cell">{formatPrice(max)} сум</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold">Товар</th>
                    <th className="text-left p-4 font-semibold hidden sm:table-cell">Категория</th>
                    <th className="text-right p-4 font-semibold hidden sm:table-cell">Цена (сум)</th>
                    <th className="text-right p-4 font-semibold hidden md:table-cell">Цена ($)</th>
                    <th className="text-right p-4 font-semibold w-28">Обновить</th>
                    <th className="text-right p-4 font-semibold w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 object-contain rounded-lg bg-card shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-muted-foreground">{p.category}</td>
                      <td className="p-4 hidden sm:table-cell">
                        <input
                          type="number"
                          className="w-32 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                          value={priceEdits[p.id]?.sum ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const sum = val === "" ? "" : val;
                            setPriceEdits((prev) => {
                              const next = { ...prev };
                              const usd = val === "" ? "" : String(usdFromSum(parseInt(val, 10)));
                              next[p.id] = { sum, usd };
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <input
                          type="number"
                          className="w-24 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                          value={priceEdits[p.id]?.usd ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPriceEdits((prev) => {
                              const next = { ...prev };
                              const usd = val === "" ? "" : val;
                              const sum = val === "" ? "" : String(sumFromUsd(parseInt(val, 10)));
                              next[p.id] = { sum, usd };
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleUpdatePrice(p.id)}
                          className="bg-primary text-primary-foreground rounded-xl px-3 py-2 font-bold text-sm hover:scale-[1.02] transition-transform"
                        >
                          Обновить
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="w-8 h-8 rounded-lg hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "add" && (
          <form onSubmit={handleAddProduct} className="glass rounded-xl p-6 max-w-2xl space-y-5">
            <h3 className="font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Добавить товар
            </h3>

            {/* Dynamic "tabs" (categories) */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">В какую вкладку добавить товар</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCategory(c)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === c ? "bg-primary text-primary-foreground" : "glass hover:border-primary/60"
                    }`}
                  >
                    {c}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowAddCategoryInput((v) => !v)}
                  className="px-4 py-2 rounded-full text-sm font-medium glass hover:border-primary/60 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  + вкладка
                </button>
              </div>

              {showAddCategoryInput && (
                <div className="flex gap-2 items-center">
                  <input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Название вкладки"
                    className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const name = newCategoryName.trim();
                      if (!name) {
                        toast.error("Введите название вкладки");
                        return;
                      }
                      if (!categories.includes(name)) {
                        setCustomCategories((prev) => [...prev, name]);
                      }
                      setSelectedCategory(name);
                      setNewCategoryName("");
                      setShowAddCategoryInput(false);
                      toast.success("Вкладка добавлена");
                    }}
                    className="bg-primary text-primary-foreground rounded-xl px-4 py-3 font-bold text-sm hover:scale-[1.02] transition-transform"
                  >
                    Добавить
                  </button>
                </div>
              )}
            </div>

            {/* Add beginning / end */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Позиция внутри вкладки</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddPosition("begin")}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    addPosition === "begin" ? "bg-primary text-primary-foreground" : "glass hover:border-primary/60"
                  }`}
                >
                  В начало
                </button>
                <button
                  type="button"
                  onClick={() => setAddPosition("end")}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    addPosition === "end" ? "bg-primary text-primary-foreground" : "glass hover:border-primary/60"
                  }`}
                >
                  В конец
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Фото товара (ссылка)</label>
              <input
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Название</label>
              <input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Название товара"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Цена (сум)</label>
                <input
                  type="number"
                  value={newProduct.priceSum}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewProduct((prev) => {
                      const sum = val;
                      const usd = val === "" ? "" : String(usdFromSum(parseInt(val, 10)));
                      return { ...prev, priceSum: sum, priceUsd: usd };
                    });
                  }}
                  placeholder="1000000"
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Цена (доллар)</label>
                <input
                  type="number"
                  value={newProduct.priceUsd}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewProduct((prev) => {
                      const usd = val;
                      const sum = val === "" ? "" : String(sumFromUsd(parseInt(val, 10)));
                      return { ...prev, priceUsd: usd, priceSum: sum };
                    });
                  }}
                  placeholder="100"
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="pt-1">
              <button className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm hover:scale-[1.02] transition-transform">
                Установить
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Admin;
