
-- Products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can read products
CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);

-- No direct insert/update/delete via client (admin uses edge function)
CREATE POLICY "No direct insert"
  ON public.products FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No direct update"
  ON public.products FOR UPDATE
  USING (false);

CREATE POLICY "No direct delete"
  ON public.products FOR DELETE
  USING (false);

-- Visitor tracking
CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_online BOOLEAN NOT NULL DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors publicly readable"
  ON public.visitors FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert visitor"
  ON public.visitors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update visitor"
  ON public.visitors FOR UPDATE
  USING (true);

-- Enable realtime for visitors
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitors;

-- Seed all 84 products
INSERT INTO public.products (id, name, category, price, image, brand, in_stock) VALUES
(1, 'Ion 600t-33', 'ИБП', 462000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-a_series_1-228x228.jpg', 'Ion', true),
(2, 'Ion a600-35', 'ИБП', 490000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-a_series_1-228x228.jpg', 'Ion', true),
(3, 'Ion a800-46', 'ИБП', 644000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-a_series_1-228x228.jpg', 'Ion', true),
(4, 'Ion a1500-105', 'ИБП', 1470000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-a_series_1-228x228.jpg', 'Ion', true),
(5, 'Ion a2000-145', 'ИБП', 2030000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-a_series_1-228x228.jpg', 'Ion', true),
(6, 'Ion v650 -41', 'ИБП', 574000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(7, 'Ion v850-54', 'ИБП', 756000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(8, 'Ion v1000t-67', 'ИБП', 938000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(9, 'Ion v1000-78', 'ИБП', 1092000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(10, 'Ion v1000lcd 85', 'ИБП', 1190000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(11, 'Ion v1200t-88', 'ИБП', 1232000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(12, 'Ion v2000-185', 'ИБП', 2590000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(13, 'Ion v2000lcd -190', 'ИБП', 2660000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(14, 'Ion v3000 lcd -335', 'ИБП', 4690000, 'https://mtca.uz/image/cache/catalog/product/ups/ion-v_series650-800-700x500.jpg', 'Ion', true),
(15, 'Ion G2000lcd -440', 'ИБП', 6160000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(16, 'Ion g3000lcd 550', 'ИБП', 7700000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(17, 'Ion g6000 v2 lcd -1230', 'ИБП', 17220000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(18, 'Ion g10.000 v2 lcd -1500', 'ИБП', 21000000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(19, 'Ion wp 1000lcd -230', 'ИБП', 3220000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(20, 'Ion wp 2000lcd -440', 'ИБП', 6160000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(21, 'Ion wp 3000lcd -540', 'ИБП', 7560000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(22, 'Ion wp 6000lcd -1200', 'ИБП', 16800000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(23, 'Ion wp 10.000 lcd -1400', 'ИБП', 19600000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(24, 'Ion 20KVA G3 PRO', 'ИБП', 53200000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(25, 'ION 30KVA G3 PRO', 'ИБП', 68600000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(26, 'ION 40KVA G3 PRO', 'ИБП', 83300000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(27, 'ION 80KVA 64KW', 'ИБП', 182000000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(28, 'ION 120KVA 96KW', 'ИБП', 266000000, 'https://seventrade.uz/upload/iblock/783/u12tb6a0au8zk6bzkq6jsu2ueqi1mz6c.jpg', 'Ion', true),
(29, 'REDMI G27Q 2K 200HZ', 'Мониторы', 2310000, 'https://frankfurt.apollo.olxcdn.com/v1/files/4k641gc9u63h3-UZ/image', 'Redmi', true),
(30, 'Philips 27m2n3500', 'Мониторы', 2730000, 'https://www.displayspecifications.com/images/model/f09d3c09/640/main.jpg', 'Philips', true),
(31, 'Philips 27m2n3500uf', 'Мониторы', 3150000, 'https://gw.alicdn.com/imgextra/i4/2415742114/O1CN01D1GpDN1RUGN1WV3QS_!!4611686018427382946-2-item_pic.png_.webp', 'Philips', true),
(32, 'Redmi x27g', 'Мониторы', 1540000, 'https://goodmi.ru/images/detailed/64/section-15-g27.jpg', 'Redmi', true),
(33, 'Mercusys 4g LTE', 'Сеть', 364000, 'https://frankfurt.apollo.olxcdn.com/v1/files/qceybl5vffvl1-UZ/image', 'Mercusys', true),
(34, 'Mercusys ms108gp poe', 'Сеть', 350000, 'https://m.media-amazon.com/images/I/61P3uwEx7JL.jpg', 'Mercusys', true),
(35, 'MERCUSYS MR80X', 'Сеть', 448000, 'https://frankfurt.apollo.olxcdn.com/v1/files/dz2leesf7jog2-UZ/image;s=1000x1000', 'Mercusys', true),
(36, 'Mercusy mr70x ax1800 wifi6', 'Сеть', 434000, 'https://maxcom.uz/storage/product/kjOQeHMxEAPNN92e8dymfou1z3YTqwSTqFd1krhe.jpeg', 'Mercusys', true),
(37, 'Mercusys MR62X', 'Сеть', 308000, 'https://static.mercusys.com/product-image/MR62X_1_normal20240614135507.jpg', 'Mercusys', true),
(38, 'Mercusys MR60X', 'Сеть', 322000, 'https://maxcom.uz/storage/product/szg0UXfgONRRniPMNoGuYsFxljXv53XAdV2ESMGr.jpeg', 'Mercusys', true),
(39, 'MERCUSYS MR47BE', 'Сеть', 1750000, 'https://static.mercusys.com/product-image/2_large20230717060240.jpg', 'Mercusys', true),
(40, 'Mercusys WIFI 7 MR27BE', 'Сеть', 770000, 'https://static.mercusys.com/product-image/MB235-4G_EU_1.0_overview_1_normal20250610023123.jpg', 'Mercusys', true),
(41, 'Mercusys WIFI 7 MR25BE', 'Сеть', 700000, 'https://static.mercusys.com/product-image/MR25BE_EU_3.0_overview_normal20251209053849.png', 'Mercusys', true),
(42, 'Mercusys MB130-4G', 'Сеть', 420000, 'https://static.mercusys.com/product-image/MB130-4G_EU_1.0_overview_07_normal20240111060818.jpg', 'Mercusys', true),
(43, 'Mercusys MB115-4G', 'Сеть', 420000, 'https://static.mercusys.com/product-image/MB115-4G_EU_1.0_overview_2_normal20250116112821.jpg', 'Mercusys', true),
(44, 'Mercusys WI-FI 6E MA86XE', 'Сеть', 308000, 'https://files.glotr.uz/company/000/002/429/proposals/2025/12/13/2025-12-13-14-19-53-338364-595ee47a5f00eccdb048f2bba42e7a60.webp?_=ozb9y', 'Mercusys', true),
(45, 'MERCUSYS WIFI 6E MA80XE', 'Сеть', 294000, 'https://files.glotr.uz/company/000/002/429/proposals/2025/12/13/2025-12-13-14-24-30-516628-c61adbba5ca5e514dfed0f797e63a219.webp?_=ozb9y', 'Mercusys', true),
(46, 'MERCUSYS WIFI 6E MA70XE', 'Сеть', 238000, 'https://static.mercusys.com/product-image/MA70XE_EU_1.0_overview_09_large20250214074652.jpg', 'Mercusys', true),
(47, 'MERCUSYS WI-FI 6E HALO H80X 3Pck', 'Сеть', 1260000, 'https://static.mercusys.com/product-image/Halo_H80X(3-pack)_3_normal20221124142617.jpg', 'Mercusys', true),
(48, 'MERCUSYS WI-FI 6E HALO H70X 3Pck', 'Сеть', 1260000, 'https://static.mercusys.com/product-image/Halo_H60X(3-pack)_3_normal20240605080733.jpg', 'Mercusys', true),
(49, 'MERCUSYS WI-FI 6E HALO H60X 3Pck', 'Сеть', 910000, 'https://static.mercusys.com/product-image/Halo_H60X(3-pack)_10_normal20240605080923.png', 'Mercusys', true),
(50, 'MERCUSYS WI-FI 6E HALO H50g 3Pck', 'Сеть', 910000, 'https://static.mercusys.com/product-image/Halo_H50G_1_for_3-pack20220117090715.jpg', 'Mercusys', true),
(51, 'MERCUSYS HALO WI-FI 7 H27BE (3-PACK)', 'Сеть', 1820000, 'https://static.mercusys.com/product-image/Halo_H27BE(3-pack_2-pack)_EU_1.0_overview_01_normal20250225013747.jpg', 'Mercusys', true),
(52, '4tb 990 pro', 'Комплектующие', 5600000, 'https://files.ox-sys.com/cache/800x_/image/18/43/16/18431627f88de7b55f568bb517e211295455a2a182d2b59ac4acfb3627ae98bf.jpg', 'Samsung', true),
(53, '4tb kingston', 'Комплектующие', 4480000, 'https://files.ox-sys.com/cache/800x_/image/cb/7d/63/cb7d6398beb2de1a14e3bcedc498a3ab7c6d73471aa85273a73b73171d201507.jpg', 'Kingston', true),
(54, 'Wd red plus 12TB', 'Комплектующие', 4690000, 'https://maxcom.uz/storage/product/rHofyrVvmTe2ZJCOAwaj1BZePfmCj0viqb1JC0ci.jpeg', 'WD', true),
(55, 'WD RED PLUS 10TB', 'Комплектующие', 4186000, 'https://maxcom.uz/storage/product/PMdYoSuvMgSDF5IOGWgviT74PT7TUHFzH4NAh1o0.jpeg', 'WD', true),
(56, 'WD RED PLUS 8TB', 'Комплектующие', 3080000, 'https://itmir.uz/image/cache/catalog/SERVERI/KOMPLEKTUYSHEYI/%D0%B6%D0%B5%D1%81%D1%82%D0%BA%D0%B8%D0%B5%20%D0%B4%D0%B8%D1%81%D0%BA%D0%B8/redpro/WD80EFPX-1000x1000.jpg', 'WD', true),
(57, 'WD RED PLUS 4TB', 'Комплектующие', 2660000, 'https://maxcom.uz/storage/product/mfKs7vSdpwbnGVxLWuQ1nQiFBxR02u0dSIDRIIxE.jpeg', 'WD', true),
(58, 'Wd MY PASSPORT 5TB USB', 'Комплектующие', 1960000, 'https://olcha.uz/image/original/products/2021-01-29/wd-my-passport-5tb-hhd-21016-2.jpeg', 'WD', true),
(59, 'usb hdd apacer 1tb', 'Комплектующие', 840000, 'https://api.idea.uz/storage/products/March2023/vUVgUfyGubc1n60yMyU4.jpg', 'Apacer', true),
(60, 'Usb hdd apacer 2tb', 'Комплектующие', 1050000, 'https://tovar.uz/images/company/265/tovar/52301/o_1_5f9f9d71ab1a5.jpg', 'Apacer', true),
(61, 'Usb ssd 1tb', 'Комплектующие', 1400000, 'https://icd.uz/upload/iblock/5e0/8480gyg5whhm7rnqa4jkpbjblosh0lm3.jpg', 'Generic', true),
(62, 'Usp ssd 2tb', 'Комплектующие', 14000, 'https://frankfurt.apollo.olxcdn.com/v1/files/3d092sqidfri-UZ/image', 'Generic', true),
(63, 'Msi h610', 'Комплектующие', 798000, 'https://files.ox-sys.com/cache/800x_/image/c4/c6/89/c4c689a3dea74212948fa1173bc80517c13ded937a0f008d4caf002f389b60bc.jpg', 'MSI', true),
(64, 'ULTRA 9285K', 'Комплектующие', 7700000, 'https://files.ox-sys.com/cache/800x_/image/d3/1b/c8/d31bc845624e5a91df45b21156b1793e12ce3fe7c6d45e10c0ce390d5c963ed4.jpg', 'Intel', true),
(65, 'I7 -14700K', 'Комплектующие', 4900000, 'https://imgproxy.onliner.by/qw3ziK62LOwv6YXrgNQSs-Et1_FHkMnCDoMweairSDQ/w:170/h:250/z:2/f:jpg/aHR0cHM6Ly9jb250/ZW50Lm9ubGluZXIu/YnkvY2F0YWxvZy9k/ZXZpY2Uvb3JpZ2lu/YWwvMGYzMTZmM2Qw/NTFlMTliMzliMzE5/ODEyMDE4MjRlNzcu/anBn', 'Intel', true),
(66, 'I7 14700kf', 'Комплектующие', 4480000, 'https://www.regard.ru/photo/goods/5999401.png', 'Intel', true),
(67, 'I9 13900k', 'Комплектующие', 5530000, 'https://files.ox-sys.com/cache/original/image/4e/6e/98/4e6e987ba9ab1758529fb4f07e567ff0215faacc91fffc55001bef17c4764515.jpg', 'Intel', true),
(68, 'Asus RTX 5060 OC 8GB', 'Комплектующие', 4900000, 'https://files.ox-sys.com/cache/original/image/3f/28/53/3f28532ad9983a9aff68fb88776674c1c72dee66387050a7087d6388367c3c3b.jpg', 'ASUS', true),
(69, 'ZOTAG GAMING RTX5060 8GB', 'Комплектующие', 4760000, 'https://files.ox-sys.com/cache/original/image/42/5e/4d/425e4d9e77f58b99e0aa0f2417260001f70b265069d4e4c73cb60c25e97e3b74.jpg', 'ZOTAC', true),
(70, 'Acer AIO 23,8 IPS 120HZ', 'Моноблоки', 7210000, 'https://m.media-amazon.com/images/I/81d8+iP6SCL._AC_SL1000__.jpg', 'Acer', true),
(71, 'Acer AIO 27 IPS 120HZ', 'Моноблоки', 8680000, 'https://pcmarket.uz/wp-content/uploads/2025/08/u0w0mwg9qk6yypa079o51o3gax8hg8ev-removebg-preview.png', 'Acer', true),
(72, 'LENOVO AIO 23.8 100HZ IPS', 'Моноблоки', 8680000, 'https://officemax.uz/media/uploads/1_z4PCnJt.jpg', 'Lenovo', true),
(73, 'LENOVO AIO 23.8 100HZ IPS', 'Моноблоки', 9240000, 'https://microless.com/cdn/products/16a0613bfaaecdcccc577bf4b71d4456-hi.jpg', 'Lenovo', true),
(74, 'Usb DVD', 'Аксессуары', 448000, 'https://frankfurt.apollo.olxcdn.com/v1/files/juimedzbe2223-UZ/image', 'Generic', true),
(75, 'Aula F75 3 IN 1 GASKET KEYBOARD', 'Аксессуары', 700000, 'https://www.aulastar.com/uploads/allimg/20250117/1-25011GHFW24.jpg', 'Aula', true),
(76, 'Aula f75 ru RED SWITCH', 'Аксессуары', 490000, 'https://mobileplanet.ua/uploads/small_photos/2024-11-25/magazin-mobileplanet-aula-f75-keycap-krgd-blue-usb-ua-black-69483912028-3303733674.webp', 'Aula', true),
(77, 'Aula f99 pro ru', 'Аксессуары', 840000, 'https://www.clife.ru/upload/himg_cache/detail-middle/e04/e049e012a1230db5eb4d16503e35722c/aula_99_pro_black_2.jpg', 'Aula', true),
(78, 'Aula s98 pro ru', 'Аксессуары', 840000, 'https://m.media-amazon.com/images/I/71+WPdLb6tL._AC_SL1500_.jpg', 'Aula', true),
(79, 'Aula sc380 pro', 'Аксессуары', 350000, 'https://dynaquestpc.com/cdn/shop/files/374_21a1fba1-0c83-433b-9671-9aaea9f4a2ca.png?v=1766376850&width=1214', 'Aula', true),
(80, 'Yandex stansiya 3', 'Аксессуары', 4480000, 'https://images.uzum.uz/ct88t26i4n3ehka297sg/t_product_low.jpg', 'Yandex', true),
(81, 'YANDEX MAX 65W', 'Аксессуары', 5180000, 'https://frankfurt.apollo.olxcdn.com/v1/files/4954xcwl4idh3-UZ/image;s=600x600', 'Yandex', true),
(82, 'Sony M6 Black', 'Аксессуары', 4620000, 'https://i.ytimg.com/vi/wtCmdWaXqYo/maxresdefault.jpg', 'Sony', true),
(83, 'Hopestor A85', 'Колонки', 1190000, 'https://frontalka.com.ua/images/b3/6e/bluetooth-kolonka-hopestar-a85-400w-black-245656-3_large.webp', 'Hopestar', true),
(84, 'Hopestor A80', 'Колонки', 910000, 'https://frankfurt.apollo.olxcdn.com/v1/files/xyjqph79l67-UZ/image', 'Hopestar', true);

-- Reset sequence
SELECT setval('products_id_seq', 84);
