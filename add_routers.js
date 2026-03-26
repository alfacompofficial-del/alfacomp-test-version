const ADMIN_PASSWORD = "Bilol2013/";
const SUPABASE_URL = "https://iyiodwdadkcukhvlkwpb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aW9kd2RhZGtjdWtodmxrd3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTY5ODQsImV4cCI6MjA4NjM5Mjk4NH0.9cgazRPkilijI9Q3wtI7adF-teTH2ur1tgWOwyYfjkU";

const products = [
  {
    name: "Archer AX73 AX5400 Dual-Band Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 1443750,
    image: "https://m.media-amazon.com/images/I/71+PCZhyyBL._AC_UF1000,1000_QL80_.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX72 Pro AX5400 Dual-Band Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 1237500,
    image: "https://fpg.uz/_next/image?url=https%3A%2F%2Fapi.fpg.uz%2Fstorage%2Fproducts%2FJuly2023%2F1787%2FDW5acKLCm1zVWKh3.jpg&w=3840&q=10",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX72 AX5400 Dual-Band Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 1182500,
    image: "https://static.tp-link.com/upload/image-line/product_01_normal_20210812031149t.png",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX55 AX3000 Dual-Band Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 811250,
    image: "https://www.netxl.com/_next/image/?url=https%3A%2F%2Fnxl-content.storage.googleapis.com%2Ftp-link%2Farcher-vx1800v-1_small.jpg&w=2560&q=75",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX53 AX3000 Dual-Band Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 687500,
    image: "https://www.linkqage.com/wp-content/uploads/2023/04/af960a1f5e894963770fb8e0cabc8227.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX20 AX1800 Dual-Band Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 797500,
    image: "https://i.rtings.com/assets/products/F3QktJS9/tp-link-archer-ax20/design-medium.jpg?format=auto",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX23 AX1800 Dual-Band Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 673750,
    image: "https://www.jumbo-computer.com/cdn/shop/files/Overview_AX23_02_large_1627273064914q_900x.jpg?v=1717055276",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX1800 AX1800 Dual-Band Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 646250,
    image: "https://images-eu.ssl-images-amazon.com/images/I/71qnmjPOL8L._AC_UL495_SR435,495_.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX10 AX1500 Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 591250,
    image: "https://content.etilize.com/900/1061521393.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer AX1500 AX1500 Wi-Fi 6 Router",
    category: "Wi-Fi роутеры",
    price: 481250,
    image: "https://m.media-amazon.com/images/I/61hqDst56RL._AC_UF1000,1000_QL80_.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer C80 AC1900 Dual-Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 453750,
    image: "https://m.media-amazon.com/images/I/71Vvj4OFQwL.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer A8 AC1900 Dual-Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 453750,
    image: "https://m.media-amazon.com/images/I/41qhq9AhETL._AC_UF894,1000_QL80_.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer C6 AC1200 Dual-Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 412500,
    image: "https://m.media-amazon.com/images/I/710f-e8eXlL._AC_UF350,350_QL50_.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer C64 AC1200 Dual-Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 357500,
    image: "https://m.media-amazon.com/images/I/71f6OUEEHdL.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer A64 AC1200 Dual-Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 357500,
    image: "https://m.media-amazon.com/images/I/61BqfwyPR8L._AC_UF1000,1000_QL80_.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer C50 AC1200 Dual-Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 295625,
    image: "https://m.media-amazon.com/images/I/61HXzuPwD-L.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer A5 AC1200 Dual-Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 295625,
    image: "https://m.media-amazon.com/images/I/51NYgciLNFL.jpg",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer C54 AC1200 Dual-Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 268125,
    image: "https://i5.walmartimages.com/asr/f80e2bbc-ca6c-4dad-aba9-76d8a5a3c964.deac6ac4664059e5f40283d677dc93fb.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    brand: "TP-Link",
    in_stock: true,
  },
  {
    name: "Archer C24 AC750 Dual Band Wi-Fi Router",
    category: "Wi-Fi роутеры",
    price: 247500,
    image: "https://www.luxtech.uz/uploads/images/202203/img_x300_6230867edcf125-81396005-47826041.jpg",
    brand: "TP-Link",
    in_stock: true,
  }
];

async function insertRouters() {
  for (const product of products) {
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/admin-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "add",
          password: ADMIN_PASSWORD,
          product: product,
        }),
      });
      if (!resp.ok) {
        console.error(`Failed to add ${product.name}`, await resp.text());
      } else {
        console.log(`Added ${product.name}`);
      }
    } catch (e) {
      console.error(`Error adding ${product.name}:`, e);
    }
  }
}

insertRouters();
