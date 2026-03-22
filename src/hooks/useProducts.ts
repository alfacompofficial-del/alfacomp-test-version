import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  brand: string;
  in_stock: boolean;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id");
      if (error) throw error;
      return data as Product[];
    },
  });
};
