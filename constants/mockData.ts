import { Product, Customer, Employee, CategorySalesDataPoint, TopSellingProductDataPoint, SalesByEmployeeDataPoint, PaymentMethodDataPoint, PurchaseOrder, PurchaseOrderItem, ShelfDisplayConfig, SupplierInfo, ProductSet } from '../types';

const newProductDataList = [
  { ProductID: "FNB-DRK-001", ProductName: "Air Mineral Dasani 600ml", Category: "Minuman", Supplier: "Coca-Cola Co.", Cost_Per_Item: 0.8, Price: 1.5, Initial_Stock: 240 },
  { ProductID: "FNB-DRK-002", ProductName: "Coca-Cola Classic 320ml", Category: "Minuman", Supplier: "Coca-Cola Co.", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 120 },
  { ProductID: "FNB-DRK-003", ProductName: "100 Plus Original 325ml", Category: "Minuman", Supplier: "F&N", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 120 },
  { ProductID: "FNB-DRK-004", ProductName: "Milo Ais (Cup)", Category: "Minuman", Supplier: "Kiosk Prepared", Cost_Per_Item: 1.5, Price: 3.0, Initial_Stock: 100 },
  { ProductID: "FNB-DRK-005", ProductName: "Kopi O Panas (Cup)", Category: "Minuman", Supplier: "Kiosk Prepared", Cost_Per_Item: 1.2, Price: 2.5, Initial_Stock: 100 },
  { ProductID: "FNB-DRK-006", ProductName: "Teh O Ais (Cup)", Category: "Minuman", Supplier: "Kiosk Prepared", Cost_Per_Item: 1.2, Price: 2.5, Initial_Stock: 100 },
  { ProductID: "FNB-DRK-007", ProductName: "Lipton Ice Tea Lemon 450ml", Category: "Minuman", Supplier: "PepsiCo", Cost_Per_Item: 1.8, Price: 3.0, Initial_Stock: 72 },
  { ProductID: "FNB-DRK-008", ProductName: "Susu Soya V-Soy Original", Category: "Minuman", Supplier: "V-Soy", Cost_Per_Item: 2.0, Price: 3.5, Initial_Stock: 48 },
  { ProductID: "FNB-DRK-009", ProductName: "Dutch Lady Milk Chocolate 200ml", Category: "Minuman", Supplier: "Dutch Lady", Cost_Per_Item: 1.7, Price: 2.8, Initial_Stock: 72 },
  { ProductID: "FNB-DRK-010", ProductName: "Nescafe Original Can 240ml", Category: "Minuman", Supplier: "Nestle", Cost_Per_Item: 2.0, Price: 3.0, Initial_Stock: 96 },
  { ProductID: "FNB-DRK-011", ProductName: "Ribena Blackcurrant Packet 200ml", Category: "Minuman", Supplier: "Suntory", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 96 },
  { ProductID: "FNB-DRK-012", ProductName: "Red Bull Energy Drink 250ml", Category: "Minuman", Supplier: "Red Bull GmbH", Cost_Per_Item: 3.0, Price: 4.5, Initial_Stock: 48 },
  { ProductID: "FNB-DRK-013", ProductName: "Air Kelapa Asli (Botol)", Category: "Minuman", Supplier: "Pembekal Tempatan", Cost_Per_Item: 3.5, Price: 5.0, Initial_Stock: 24 },
  { ProductID: "FNB-DRK-014", ProductName: "Jus Oren Twister 350ml", Category: "Minuman", Supplier: "PepsiCo", Cost_Per_Item: 2.2, Price: 3.5, Initial_Stock: 48 },
  { ProductID: "FNB-DRK-015", ProductName: "Yakult Ace Light", Category: "Minuman", Supplier: "Yakult", Cost_Per_Item: 4.0, Price: 5.5, Initial_Stock: 50 },
  { ProductID: "FNB-DRK-016", ProductName: "Cincau Ais (Cup)", Category: "Minuman", Supplier: "Kiosk Prepared", Cost_Per_Item: 1.5, Price: 3.0, Initial_Stock: 80 },
  { ProductID: "FNB-DRK-017", ProductName: "Air Soya Kotak Yeo's", Category: "Minuman", Supplier: "Yeo's", Cost_Per_Item: 1.3, Price: 2.2, Initial_Stock: 96 },
  { ProductID: "FNB-DRK-018", ProductName: "Susu Goodday Full Cream 200ml", Category: "Minuman", Supplier: "Etika", Cost_Per_Item: 1.8, Price: 2.8, Initial_Stock: 72 },
  { ProductID: "FNB-DRK-019", ProductName: "Sprite 320ml", Category: "Minuman", Supplier: "Coca-Cola Co.", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 72 },
  { ProductID: "FNB-SNK-001", ProductName: "Twisties Super Ring Cheese 60g", Category: "Snek", Supplier: "Mondelez", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 60 },
  { ProductID: "FNB-SNK-002", ProductName: "Mister Potato Original 60g", Category: "Snek", Supplier: "Mamee-Double Decker", Cost_Per_Item: 2.0, Price: 3.0, Initial_Stock: 60 },
  { ProductID: "FNB-SNK-003", ProductName: "Jack 'n Jill Roller Coaster BBQ", Category: "Snek", Supplier: "URC", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 60 },
  { ProductID: "FNB-SNK-004", ProductName: "Pringles Original 110g", Category: "Snek", Supplier: "Kellogg's", Cost_Per_Item: 5.0, Price: 7.0, Initial_Stock: 36 },
  { ProductID: "FNB-SNK-005", ProductName: "Kacang Ngan Yin", Category: "Snek", Supplier: "Ngan Yin", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 50 },
  { ProductID: "FNB-SNK-006", ProductName: "Mamee Monster Noodle Snack", Category: "Snek", Supplier: "Mamee-Double Decker", Cost_Per_Item: 1.0, Price: 1.5, Initial_Stock: 100 },
  { ProductID: "FNB-SNK-007", ProductName: "Popo Muruku Ikan", Category: "Snek", Supplier: "Thien Cheong", Cost_Per_Item: 1.2, Price: 2.0, Initial_Stock: 50 },
  { ProductID: "FNB-SNK-008", ProductName: "Super Ring (Large)", Category: "Snek", Supplier: "Mondelez", Cost_Per_Item: 2.5, Price: 3.8, Initial_Stock: 40 },
  { ProductID: "FNB-RTG-001", ProductName: "Roti Gardenia Original Classic", Category: "Roti & Bakeri", Supplier: "Gardenia", Cost_Per_Item: 2.5, Price: 3.5, Initial_Stock: 40 },
  { ProductID: "FNB-RTG-002", ProductName: "Roti Gardenia Coklat", Category: "Roti & Bakeri", Supplier: "Gardenia", Cost_Per_Item: 0.8, Price: 1.2, Initial_Stock: 60 },
  { ProductID: "FNB-RTG-003", ProductName: "Apollo Chocolate Layer Cake", Category: "Roti & Bakeri", Supplier: "Apollo", Cost_Per_Item: 0.7, Price: 1.0, Initial_Stock: 80 },
  { ProductID: "FNB-RTG-004", ProductName: "Apollo Pandan Layer Cake", Category: "Roti & Bakeri", Supplier: "Apollo", Cost_Per_Item: 0.7, Price: 1.0, Initial_Stock: 80 },
  { ProductID: "FNB-RTG-005", ProductName: "Pau Kaya (Panas)", Category: "Makanan Sedia", Supplier: "Pembekal Tempatan", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 30 },
  { ProductID: "FNB-RTG-006", ProductName: "Pau Kacang Merah (Panas)", Category: "Makanan Sedia", Supplier: "Pembekal Tempatan", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 30 },
  { ProductID: "FNB-RTG-007", ProductName: "Karipap Kentang (Panas)", Category: "Makanan Sedia", Supplier: "Pembekal Tempatan", Cost_Per_Item: 0.6, Price: 1.0, Initial_Stock: 50 },
  { ProductID: "FNB-RTG-008", ProductName: "Nasi Lemak Bungkus Daun Pisang", Category: "Makanan Sedia", Supplier: "Mak Leha Enterprise", Cost_Per_Item: 2.5, Price: 4.0, Initial_Stock: 40 },
  { ProductID: "FNB-RTG-009", ProductName: "Mee Hoon Goreng Bungkus", Category: "Makanan Sedia", Supplier: "Mak Leha Enterprise", Cost_Per_Item: 3.0, Price: 4.5, Initial_Stock: 40 },
  { ProductID: "FNB-RTG-010", ProductName: "Sandwich Telur Mayo", Category: "Makanan Sedia", Supplier: "Kiosk Prepared", Cost_Per_Item: 2.8, Price: 4.0, Initial_Stock: 20 },
  { ProductID: "FNB-RTG-011", ProductName: "Sandwich Tuna Mayo", Category: "Makanan Sedia", Supplier: "Kiosk Prepared", Cost_Per_Item: 3.2, Price: 4.5, Initial_Stock: 20 },
  { ProductID: "FNB-RTG-012", ProductName: "Bihun Sup Bungkus", Category: "Makanan Sedia", Supplier: "Mak Leha Enterprise", Cost_Per_Item: 3.5, Price: 5.0, Initial_Stock: 30 },
  { ProductID: "FNB-BSK-001", ProductName: "Biskut Tiger", Category: "Biskut", Supplier: "Mondelez", Cost_Per_Item: 1.8, Price: 2.8, Initial_Stock: 30 },
  { ProductID: "FNB-BSK-002", ProductName: "Oreo Original", Category: "Biskut", Supplier: "Mondelez", Cost_Per_Item: 2.0, Price: 3.2, Initial_Stock: 40 },
  { ProductID: "FNB-BSK-003", ProductName: "Jacobs Cream Cracker", Category: "Biskut", Supplier: "Mondelez", Cost_Per_Item: 3.5, Price: 5.0, Initial_Stock: 24 },
  { ProductID: "FNB-BSK-004", ProductName: "Lexus Chocolate Biscuit", Category: "Biskut", Supplier: "Munchy's", Cost_Per_Item: 4.0, Price: 5.5, Initial_Stock: 30 },
  { ProductID: "FNB-CND-001", ProductName: "Cadbury Dairy Milk 40g", Category: "Coklat & Gula-gula", Supplier: "Mondelez", Cost_Per_Item: 2.5, Price: 3.8, Initial_Stock: 50 },
  { ProductID: "FNB-CND-002", ProductName: "KitKat 2 Finger", Category: "Coklat & Gula-gula", Supplier: "Nestle", Cost_Per_Item: 1.0, Price: 1.5, Initial_Stock: 80 },
  { ProductID: "FNB-CND-003", ProductName: "Mentos Rainbow", Category: "Coklat & Gula-gula", Supplier: "Perfetti Van Melle", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 60 },
  { ProductID: "FNB-CND-004", ProductName: "Chupa Chups Lollipop", Category: "Coklat & Gula-gula", Supplier: "Perfetti Van Melle", Cost_Per_Item: 0.4, Price: 0.8, Initial_Stock: 100 },
  { ProductID: "FNB-CND-005", ProductName: "Doublemint Chewing Gum", Category: "Coklat & Gula-gula", Supplier: "Wrigley's", Cost_Per_Item: 1.2, Price: 2.0, Initial_Stock: 80 },
  { ProductID: "FNB-CND-006", ProductName: "Fisherman's Friend", Category: "Coklat & Gula-gula", Supplier: "Lofthouse", Cost_Per_Item: 3.0, Price: 4.2, Initial_Stock: 50 },
  { ProductID: "FNB-FRT-001", ProductName: "Kismis Sun-Maid (Kotak Kecil)", Category: "Buah & Kekacang", Supplier: "Sun-Maid", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 40 },
  { ProductID: "FNB-FRT-002", ProductName: "Buah Epal Merah", Category: "Buah & Kekacang", Supplier: "Pembekal Buah", Cost_Per_Item: 1.2, Price: 2.0, Initial_Stock: 30 },
  { ProductID: "FNB-FRT-003", ProductName: "Buah Pisang Berangan", Category: "Buah & Kekacang", Supplier: "Pembekal Buah", Cost_Per_Item: 0.8, Price: 1.5, Initial_Stock: 40 },
  { ProductID: "ESS-TLT-001", ProductName: "Ubat Gigi Colgate 50g", Category: "Peralatan Mandian", Supplier: "Colgate-Palmolive", Cost_Per_Item: 3.0, Price: 4.5, Initial_Stock: 24 },
  { ProductID: "ESS-TLT-002", ProductName: "Berus Gigi Colgate Travel", Category: "Peralatan Mandian", Supplier: "Colgate-Palmolive", Cost_Per_Item: 2.5, Price: 4.0, Initial_Stock: 36 },
  { ProductID: "ESS-TLT-003", ProductName: "Sabun Mandi Dettol Original", Category: "Peralatan Mandian", Supplier: "Reckitt", Cost_Per_Item: 2.0, Price: 3.5, Initial_Stock: 36 },
  { ProductID: "ESS-TLT-004", ProductName: "Syampu Sunsilk Hijau 70ml", Category: "Peralatan Mandian", Supplier: "Unilever", Cost_Per_Item: 3.5, Price: 5.0, Initial_Stock: 24 },
  { ProductID: "ESS-TLT-005", ProductName: "Tuala Muka Kecil", Category: "Peralatan Mandian", Supplier: "Perniagaan Jaya", Cost_Per_Item: 4.0, Price: 7.0, Initial_Stock: 24 },
  { ProductID: "ESS-TLT-006", ProductName: "Sikat Rambut", Category: "Peralatan Mandian", Supplier: "Perniagaan Jaya", Cost_Per_Item: 2.0, Price: 3.5, Initial_Stock: 30 },
  { ProductID: "ESS-TLT-007", ProductName: "Wet Wipes Dettol (10 pcs)", Category: "Peralatan Mandian", Supplier: "Reckitt", Cost_Per_Item: 2.5, Price: 4.0, Initial_Stock: 40 },
  { ProductID: "ESS-TLT-008", ProductName: "Lip Balm Nivea", Category: "Peralatan Mandian", Supplier: "Beiersdorf", Cost_Per_Item: 5.0, Price: 8.0, Initial_Stock: 24 },
  { ProductID: "ESS-TLT-009", ProductName: "Gillette Blue II Razor", Category: "Peralatan Mandian", Supplier: "P&G", Cost_Per_Item: 1.8, Price: 3.0, Initial_Stock: 30 },
  { ProductID: "ESS-TLT-010", ProductName: "Deodoran Nivea (Kecil)", Category: "Peralatan Mandian", Supplier: "Beiersdorf", Cost_Per_Item: 4.0, Price: 6.0, Initial_Stock: 24 },
  { ProductID: "ESS-TLT-011", ProductName: "Kapas Muka", Category: "Peralatan Mandian", Supplier: "Perniagaan Jaya", Cost_Per_Item: 2.5, Price: 4.0, Initial_Stock: 20 },
  { ProductID: "ESS-TLT-012", ProductName: "Baby Oil Johnson's 50ml", Category: "Peralatan Mandian", Supplier: "Johnson & Johnson", Cost_Per_Item: 4.0, Price: 6.0, Initial_Stock: 24 },
  { ProductID: "ESS-TLT-013", ProductName: "Dry Shampoo (Travel Size)", Category: "Peralatan Mandian", Supplier: "Cosway", Cost_Per_Item: 8.0, Price: 12.0, Initial_Stock: 12 },
  { ProductID: "ESS-TLT-014", ProductName: "Sabun Tangan Lifebuoy", Category: "Peralatan Mandian", Supplier: "Unilever", Cost_Per_Item: 4.5, Price: 6.5, Initial_Stock: 24 },
  { ProductID: "ESS-TLT-015", ProductName: "Losyen Nivea (Kecil)", Category: "Peralatan Mandian", Supplier: "Beiersdorf", Cost_Per_Item: 5.5, Price: 8.5, Initial_Stock: 24 },
  { ProductID: "ESS-TLT-016", ProductName: "Gunting Kuku", Category: "Peralatan Mandian", Supplier: "Perniagaan Jaya", Cost_Per_Item: 2.0, Price: 3.5, Initial_Stock: 30 },
  { ProductID: "ESS-HBC-001", ProductName: "Hand Sanitizer Dettol 50ml", Category: "Kesihatan Asas", Supplier: "Reckitt", Cost_Per_Item: 4.0, Price: 6.0, Initial_Stock: 48 },
  { ProductID: "ESS-HBC-002", ProductName: "Minyak Angin Cap Kapak", Category: "Kesihatan Asas", Supplier: "Cap Kapak", Cost_Per_Item: 3.0, Price: 4.5, Initial_Stock: 36 },
  { ProductID: "ESS-HBC-003", ProductName: "Panadol Actifast (1 Strip)", Category: "Kesihatan Asas", Supplier: "GSK", Cost_Per_Item: 3.5, Price: 5.0, Initial_Stock: 50 },
  { ProductID: "ESS-HBC-004", ProductName: "Plaster Hansaplast (Pek)", Category: "Kesihatan Asas", Supplier: "Beiersdorf", Cost_Per_Item: 2.0, Price: 3.5, Initial_Stock: 50 },
  { ProductID: "ESS-HBC-005", ProductName: "Vicks VapoRub 10g", Category: "Kesihatan Asas", Supplier: "P&G", Cost_Per_Item: 4.5, Price: 6.5, Initial_Stock: 30 },
  { ProductID: "ESS-HBC-006", ProductName: "Air Badak", Category: "Kesihatan Asas", Supplier: "Wen Ken Drug", Cost_Per_Item: 1.2, Price: 2.0, Initial_Stock: 48 },
  { ProductID: "ESS-HBC-007", ProductName: "Strepsils Honey Lemon", Category: "Kesihatan Asas", Supplier: "Reckitt", Cost_Per_Item: 4.5, Price: 6.0, Initial_Stock: 40 },
  { ProductID: "ESS-HBC-008", ProductName: "Topeng Muka Pembedahan (1 pc)", Category: "Kesihatan Asas", Supplier: "Perniagaan Jaya", Cost_Per_Item: 0.4, Price: 1.0, Initial_Stock: 200 },
  { ProductID: "ESS-HBC-009", ProductName: "Cermin Mata Baca (+1.5)", Category: "Kesihatan Asas", Supplier: "Spek Muroh Ent", Cost_Per_Item: 8.0, Price: 15.0, Initial_Stock: 12 },
  { ProductID: "ESS-HYG-001", ProductName: "Tisu Muka Kleenex (Pek Poket)", Category: "Kebersihan", Supplier: "Kimberly-Clark", Cost_Per_Item: 1.0, Price: 1.8, Initial_Stock: 100 },
  { ProductID: "ESS-HYG-002", ProductName: "Kotex Panty Liners", Category: "Kebersihan", Supplier: "Kimberly-Clark", Cost_Per_Item: 3.0, Price: 4.5, Initial_Stock: 30 },
  { ProductID: "ESS-HYG-003", ProductName: "Tisu Basah Bayi (Pek Kecil)", Category: "Kebersihan", Supplier: "J&J", Cost_Per_Item: 3.5, Price: 5.5, Initial_Stock: 30 },
  { ProductID: "ESS-HYG-004", ProductName: "Benang Gigi Oral-B", Category: "Kebersihan", Supplier: "P&G", Cost_Per_Item: 6.0, Price: 9.0, Initial_Stock: 24 },
  { ProductID: "ESS-CLO-001", ProductName: "Slipper Hospital", Category: "Pakaian Asas", Supplier: "Perniagaan Jaya", Cost_Per_Item: 5.0, Price: 9.0, Initial_Stock: 24 },
  { ProductID: "ESS-CLO-002", ProductName: "Stokin", Category: "Pakaian Asas", Supplier: "Perniagaan Jaya", Cost_Per_Item: 4.0, Price: 7.0, Initial_Stock: 36 },
  { ProductID: "ESS-CLO-003", ProductName: "Sleeping Eye Mask", Category: "Pakaian Asas", Supplier: "Perniagaan Jaya", Cost_Per_Item: 4.0, Price: 7.0, Initial_Stock: 24 },
  { ProductID: "ESS-CLO-004", ProductName: "Selendang/Shawl Nipis", Category: "Pakaian Asas", Supplier: "Perniagaan Jaya", Cost_Per_Item: 10.0, Price: 18.0, Initial_Stock: 12 },
  { ProductID: "ESS-ELC-001", ProductName: "USB-C Cable 1m", Category: "Elektronik", Supplier: "PowerUp", Cost_Per_Item: 5.0, Price: 15.0, Initial_Stock: 24 },
  { ProductID: "ESS-ELC-002", ProductName: "iPhone Cable 1m", Category: "Elektronik", Supplier: "PowerUp", Cost_Per_Item: 6.0, Price: 18.0, Initial_Stock: 24 },
  { ProductID: "ESS-ELC-003", ProductName: "Palam Pengecas USB", Category: "Elektronik", Supplier: "PowerUp", Cost_Per_Item: 12.0, Price: 25.0, Initial_Stock: 12 },
  { ProductID: "ESS-ELC-004", ProductName: "Power Bank Pakai Buang (Pre-charged)", Category: "Elektronik", Supplier: "ChargeGo", Cost_Per_Item: 20.0, Price: 35.0, Initial_Stock: 10 },
  { ProductID: "ESS-ELC-005", ProductName: "Earphone Basic", Category: "Elektronik", Supplier: "Soundz", Cost_Per_Item: 8.0, Price: 15.0, Initial_Stock: 20 },
  { ProductID: "ESS-ELC-006", ProductName: "Bateri AA Energizer (2 pcs)", Category: "Elektronik", Supplier: "Energizer", Cost_Per_Item: 4.5, Price: 6.5, Initial_Stock: 24 },
  { ProductID: "ESS-ELC-007", ProductName: "Bateri AAA Energizer (2 pcs)", Category: "Elektronik", Supplier: "Energizer", Cost_Per_Item: 4.5, Price: 6.5, Initial_Stock: 24 },
  { ProductID: "GFT-HMP-001", ProductName: "Hamper Buah (Kecil)", Category: "Hadiah", Supplier: "Kiosk Prepared", Cost_Per_Item: 20.0, Price: 35.0, Initial_Stock: 10 },
  { ProductID: "GFT-HMP-002", ProductName: "Hamper Kesihatan (Brand's)", Category: "Hadiah", Supplier: "Brand's Suntory", Cost_Per_Item: 25.0, Price: 40.0, Initial_Stock: 8 },
  { ProductID: "GFT-GWL-001", ProductName: "Belon \"Get Well Soon\"", Category: "Hadiah", Supplier: "Cenderahati Maju", Cost_Per_Item: 5.0, Price: 10.0, Initial_Stock: 20 },
  { ProductID: "GFT-GWL-002", ProductName: "Kad Ucapan", Category: "Hadiah", Supplier: "Cenderahati Maju", Cost_Per_Item: 2.0, Price: 4.0, Initial_Stock: 50 },
  { ProductID: "GFT-GWL-003", ProductName: "Anak Patung Beruang Kecil", Category: "Hadiah", Supplier: "Cenderahati Maju", Cost_Per_Item: 10.0, Price: 20.0, Initial_Stock: 15 },
  { ProductID: "GFT-GWL-004", ProductName: "Set Penjagaan Diri (Pack)", Category: "Hadiah", Supplier: "Kiosk Prepared", Cost_Per_Item: 15.0, Price: 25.0, Initial_Stock: 10 },
  { ProductID: "GFT-GWL-005", ProductName: "Bunga Tiruan (Satu Tangkai)", Category: "Hadiah", Supplier: "Cenderahati Maju", Cost_Per_Item: 4.0, Price: 8.0, Initial_Stock: 30 },
  { ProductID: "GFT-GWL-006", ProductName: "Kotak Hadiah Kecil", Category: "Hadiah", Supplier: "Cenderahati Maju", Cost_Per_Item: 3.0, Price: 5.0, Initial_Stock: 20 },
  { ProductID: "GFT-GWL-007", ProductName: "Reben", Category: "Hadiah", Supplier: "Cenderahati Maju", Cost_Per_Item: 2.5, Price: 4.0, Initial_Stock: 15 },
  { ProductID: "PUB-MGA-001", ProductName: "Majalah Mingguan Wanita", Category: "Penerbitan", Supplier: "Karisma Publications", Cost_Per_Item: 4.0, Price: 5.5, Initial_Stock: 15 },
  { ProductID: "PUB-NWS-001", ProductName: "Surat Khabar (The Star)", Category: "Penerbitan", Supplier: "Star Media", Cost_Per_Item: 1.5, Price: 2.0, Initial_Stock: 30 },
  { ProductID: "PUB-NWS-002", ProductName: "Surat Khabar (Berita Harian)", Category: "Penerbitan", Supplier: "NSTP", Cost_Per_Item: 1.5, Price: 2.0, Initial_Stock: 30 },
  { ProductID: "PUB-PZL-001", ProductName: "Buku Sudoku", Category: "Penerbitan", Supplier: "Puzzle Media", Cost_Per_Item: 3.5, Price: 5.0, Initial_Stock: 20 },
  { ProductID: "PUB-PZL-002", ProductName: "Buku Silang Kata", Category: "Penerbitan", Supplier: "Puzzle Media", Cost_Per_Item: 3.5, Price: 5.0, Initial_Stock: 20 },
  { ProductID: "STA-WRT-001", ProductName: "Pen Bola Hitam Pilot", Category: "Alat Tulis", Supplier: "Pilot", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 50 },
  { ProductID: "STA-WRT-002", ProductName: "Buku Nota Kecil", Category: "Alat Tulis", Supplier: "Perniagaan Jaya", Cost_Per_Item: 2.0, Price: 3.5, Initial_Stock: 40 },
  { ProductID: "STA-WRT-003", ProductName: "Sampul Surat Putih", Category: "Alat Tulis", Supplier: "Perniagaan Jaya", Cost_Per_Item: 0.5, Price: 1.0, Initial_Stock: 80 },
  { ProductID: "STA-ACS-001", ProductName: "Pita Salotep Kecil", Category: "Alat Tulis", Supplier: "Perniagaan Jaya", Cost_Per_Item: 1.5, Price: 2.5, Initial_Stock: 30 },
  { ProductID: "STA-ACS-002", ProductName: "Klip Kertas (Kotak Kecil)", Category: "Alat Tulis", Supplier: "Perniagaan Jaya", Cost_Per_Item: 1.2, Price: 2.0, Initial_Stock: 30 },
  { ProductID: "STA-ACS-003", ProductName: "Pelekat 'Double Sided'", Category: "Alat Tulis", Supplier: "Perniagaan Jaya", Cost_Per_Item: 2.0, Price: 3.5, Initial_Stock: 24 },
  { ProductID: "STA-ACS-004", ProductName: "Pembaris Kecil", Category: "Alat Tulis", Supplier: "Perniagaan Jaya", Cost_Per_Item: 1.0, Price: 1.8, Initial_Stock: 30 },
  { ProductID: "TOB-CIG-001", ProductName: "Rokok Dunhill", Category: "Tembakau", Supplier: "BAT", Cost_Per_Item: 16.5, Price: 17.5, Initial_Stock: 40 },
  { ProductID: "TOB-CIG-002", ProductName: "Rokok Mevius", Category: "Tembakau", Supplier: "JTI", Cost_Per_Item: 16.5, Price: 17.5, Initial_Stock: 40 },
  { ProductID: "TOB-CIG-003", ProductName: "Rokok Winston", Category: "Tembakau", Supplier: "JTI", Cost_Per_Item: 15.0, Price: 16.0, Initial_Stock: 30 },
  { ProductID: "TOB-ACS-001", ProductName: "Lighter", Category: "Tembakau", Supplier: "Flamer Ent.", Cost_Per_Item: 2.0, Price: 3.0, Initial_Stock: 50 },
  { ProductID: "SVC-RLD-001", ProductName: "Topup Maxis RM10", Category: "Servis Digital", Supplier: "Maxis", Cost_Per_Item: 9.8, Price: 10.0, Initial_Stock: 9999 },
  { ProductID: "SVC-RLD-002", ProductName: "Topup Celcom RM10", Category: "Servis Digital", Supplier: "Celcom", Cost_Per_Item: 9.8, Price: 10.0, Initial_Stock: 9999 },
  { ProductID: "SVC-RLD-003", ProductName: "Topup Digi RM10", Category: "Servis Digital", Supplier: "Digi", Cost_Per_Item: 9.8, Price: 10.0, Initial_Stock: 9999 },
  { ProductID: "SVC-PHO-001", ProductName: "Servis Fotostat A4 (per page)", Category: "Servis Fizikal", Supplier: "Kiosk Service", Cost_Per_Item: 0.2, Price: 0.5, Initial_Stock: 9999 },
  { ProductID: "MSC-KIT-001", ProductName: "Botol Air Kosong", Category: "Lain-lain", Supplier: "Perniagaan Jaya", Cost_Per_Item: 5.0, Price: 8.0, Initial_Stock: 30 },
  { ProductID: "MSC-KIT-002", ProductName: "Payung Lipat", Category: "Lain-lain", Supplier: "Perniagaan Jaya", Cost_Per_Item: 10.0, Price: 18.0, Initial_Stock: 12 },
  { ProductID: "MSC-KIT-003", ProductName: "Beg Kertas", Category: "Lain-lain", Supplier: "Perniagaan Jaya", Cost_Per_Item: 1.0, Price: 1.5, Initial_Stock: 100 },
  { ProductID: "MSC-KIT-004", ProductName: "Mangkuk & Sudu Plastik", Category: "Lain-lain", Supplier: "Perniagaan Jaya", Cost_Per_Item: 2.5, Price: 4.0, Initial_Stock: 30 },
  { ProductID: "MSC-KIT-005", ProductName: "Kunci Mangga Kecil", Category: "Lain-lain", Supplier: "Perniagaan Jaya", Cost_Per_Item: 5.0, Price: 9.0, Initial_Stock: 20 },
  { ProductID: "MSC-KIT-006", ProductName: "Jarum dan Benang (Set)", Category: "Lain-lain", Supplier: "Perniagaan Jaya", Cost_Per_Item: 2.5, Price: 4.5, Initial_Stock: 20 },
  { ProductID: "MSC-KIT-007", ProductName: "Botol Spray Kosong Kecil", Category: "Lain-lain", Supplier: "Perniagaan Jaya", Cost_Per_Item: 3.0, Price: 5.0, Initial_Stock: 24 }
];

const categoryDefaultInfo: Record<string, { image: string; hasExpiryDate: boolean }> = {
  "Minuman": { image: '🥤', hasExpiryDate: true },
  "Snek": { image: '🍪', hasExpiryDate: true },
  "Roti & Bakeri": { image: '🍞', hasExpiryDate: true },
  "Makanan Sedia": { image: '🍛', hasExpiryDate: true },
  "Biskut": { image: '🍘', hasExpiryDate: true },
  "Coklat & Gula-gula": { image: '🍬', hasExpiryDate: true },
  "Buah & Kekacang": { image: '🍎', hasExpiryDate: true },
  "Peralatan Mandian": { image: '🧼', hasExpiryDate: false },
  "Kesihatan Asas": { image: '🩹', hasExpiryDate: true },
  "Kebersihan": { image: '🧻', hasExpiryDate: false },
  "Pakaian Asas": { image: '👕', hasExpiryDate: false },
  "Elektronik": { image: '🔌', hasExpiryDate: false },
  "Hadiah": { image: '🎁', hasExpiryDate: false },
  "Penerbitan": { image: '📰', hasExpiryDate: false },
  "Alat Tulis": { image: '✏️', hasExpiryDate: false },
  "Tembakau": { image: '🚬', hasExpiryDate: true },
  "Servis Digital": { image: '🛠️', hasExpiryDate: false },
  "Servis Fizikal": { image: '⚙️', hasExpiryDate: false },
  "Lain-lain": { image: '📦', hasExpiryDate: false },
  "Default": { image: '❓', hasExpiryDate: false }
};

export const mockProducts: Product[] = newProductDataList.map((p, index) => {
  const defaults = categoryDefaultInfo[p.Category] || categoryDefaultInfo["Default"];
  let hasExpiryDate = defaults.hasExpiryDate;

  // Specific overrides for expiry
  if (p.ProductID === "ESS-TLT-012" || p.ProductID === "ESS-HBC-005" || p.ProductID === "ESS-HBC-007") {
    hasExpiryDate = true;
  }
  
  const initialStock = Number(p.Initial_Stock);
  let reorderLevel = Math.max(5, Math.floor(initialStock * 0.15));
  if (p.Category === "Servis Digital" || p.Category === "Servis Fizikal") {
      reorderLevel = 500; // High reorder for services
  }


  return {
    id: index + 1, // Simple numeric ID
    name: p.ProductName,
    price: Number(p.Price),
    category: p.Category,
    image: defaults.image,
    stock: initialStock,
    sku: p.ProductID,
    reorderLevel: reorderLevel,
    shelfLocationId: `SHELF-${p.Category.substring(0,3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
    currentShelfLocationId: `SHELF-${p.Category.substring(0,3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
    hasExpiryDate: hasExpiryDate,
    simulatedVisionLabels: [p.Category, p.ProductName.split(' ')[0], p.Supplier],
    isVisuallyAmbiguous: false,
    similarProductIds: [],
    requiresScale: false, // Defaulting all to false as per data
    pricePerUnit: undefined,
    unitName: undefined,
    requiresAgeVerification: p.Category === "Tembakau",
  };
});

// Update mockProductCategories based on the new data
const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category)));
export const mockProductCategories: string[] = ["Semua", ...uniqueCategories.sort()];


export const mockCustomers: Customer[] = [
    { id: 'C001', name: 'Ahmad bin Ismail', email: 'ahmad@mail.com', phone: '012-3456789', totalSpent: 5670.50 },
    { id: 'C002', name: 'Siti Saleha', email: 'siti@mail.com', phone: '019-8765432', totalSpent: 890.00 },
    { id: 'C003', name: 'John Doe', email: 'john.doe@example.com', phone: '011-1234567', totalSpent: 1250.75 },
];

export let mockEmployeesData: Employee[] = [
    {
        id: 'E001',
        fullname: 'Ali bin Abu',
        email: 'ali@pos.com',
        phone: '012-1112222',
        department: 'sales',
        role: 'cashier',
        pin: '1234',
        startDate: '2023-01-15',
        status: 'Aktif',
        permissions: {manualDiscount: true, processRefund: false, fullAccess: false}
    },
    {
        id: 'E002',
        fullname: 'Siti binti Kassim',
        email: 'siti@pos.com',
        phone: '012-3334444',
        department: 'management',
        role: 'manager',
        pin: '5678',
        startDate: '2022-05-20',
        status: 'Aktif',
        permissions: {manualDiscount: true, processRefund: true, fullAccess: true}
    },
     {
        id: 'E003',
        fullname: 'David Lee',
        email: 'david@pos.com',
        phone: '012-5556666',
        department: 'sales',
        role: 'cashier',
        pin: '1122',
        startDate: '2023-03-10',
        status: 'Aktif',
        permissions: {manualDiscount: true, processRefund: false, fullAccess: false}
    },
];

// Mock Data For Reports Page
export const mockDailySalesData = [
    { name: 'Mon', sales: 1200 }, { name: 'Tue', sales: 1500 }, { name: 'Wed', sales: 1100 },
    { name: 'Thu', sales: 1800 }, { name: 'Fri', sales: 2200 }, { name: 'Sat', sales: 2500 },
    { name: 'Sun', sales: 1900 }
];

export const mockWeeklySalesData = [ 
    { name: 'Week 1', sales: 7500 }, { name: 'Week 2', sales: 8200 },
    { name: 'Week 3', sales: 7900 }, { name: 'Week 4', sales: 8500 }
];

export const mockMonthlySalesData = [ 
    { name: 'Jan', sales: 30000 }, { name: 'Feb', sales: 28000 },
    { name: 'Mar', sales: 32000 }, { name: 'Apr', sales: 31000 }
];


export const mockCategorySalesData: CategorySalesDataPoint[] = [
    { categoryKey: 'pos_cat_drinks', sales: 4500 },
    { categoryKey: 'pos_cat_snacks', sales: 3200 },
    { categoryKey: 'pos_cat_rte', sales: 2800 }, // Ready to Eat / Makanan Sedia
    { categoryKey: 'pos_cat_toiletries', sales: 1800 }, // Peralatan Mandian
    { categoryKey: 'pos_cat_health_basic', sales: 1500 } // Kesihatan Asas
];

// Clear top selling products as IDs have changed. The report will show "Data not available".
export const mockTopSellingProducts: TopSellingProductDataPoint[] = [];

export const mockSalesByEmployee: SalesByEmployeeDataPoint[] = [
    { employeeId: 'E002', employeeName: 'Siti binti Kassim', totalSales: 12500, transactions: 150 },
    { employeeId: 'E001', employeeName: 'Ali bin Abu', totalSales: 9800, transactions: 120 },
    { employeeId: 'E003', employeeName: 'David Lee', totalSales: 7500, transactions: 90 },
];

export const mockPaymentMethodData: PaymentMethodDataPoint[] = [
    { methodKey: 'payment_method_cash', totalAmount: 15200, transactionCount: 180 },
    { methodKey: 'payment_method_card', totalAmount: 10800, transactionCount: 95 },
    { methodKey: 'payment_method_ewallet', totalAmount: 3800, transactionCount: 85 },
];

// Helper to find new product ID by old SKU-like name if needed for remapping
const findNewIdByOldSku = (sku: string): number | undefined => {
    const product = mockProducts.find(p => p.sku === sku);
    return product?.id;
};

// Mock Data for Vision AI Stock In - Update Product IDs
export const mockPurchaseOrders: PurchaseOrder[] = [
    {
        id: 'PO2024001',
        poNumber: 'PO-XYZ-001',
        orderDate: '2024-07-15',
        supplierName: 'Snek Borong Sdn Bhd',
        status: 'Pending',
        items: [
            // Old: { productId: 9, productName: "Oreo Cadbury Cookies 54g", expectedQuantity: 100 },
            // New: FNB-BSK-002,Oreo Original
            { productId: findNewIdByOldSku("FNB-BSK-002")!, productName: "Oreo Original", expectedQuantity: 100 },
            // Old: { productId: 10, productName: "Hup Seng Cream Crackers 428g", expectedQuantity: 50 },
            // New: This item is not in the new list, let's find a similar cracker.
            // "Jacobs Cream Cracker" (FNB-BSK-003)
            { productId: findNewIdByOldSku("FNB-BSK-003")!, productName: "Jacobs Cream Cracker", expectedQuantity: 50 },
        ].filter(item => item.productId !== undefined) as PurchaseOrderItem[] // Filter out if findNewIdByOldSku returns undefined
    },
    {
        id: 'PO2024002',
        poNumber: 'PO-ABC-002',
        orderDate: '2024-07-20',
        supplierName: 'Minuman Segar Enterprise',
        status: 'Pending',
        items: [
            // Old: { productId: 1, productName: "Kopi Ais Kaw", expectedQuantity: 200 },
            // New: FNB-DRK-005,Kopi O Panas (Cup)
            { productId: findNewIdByOldSku("FNB-DRK-005")!, productName: "Kopi O Panas (Cup)", expectedQuantity: 200 },
             // Old: { productId: 3, productName: "Teh O Ais Limau", expectedQuantity: 150 },
            // New: FNB-DRK-006,Teh O Ais (Cup) (Limau part is missing, but close enough for mock)
            { productId: findNewIdByOldSku("FNB-DRK-006")!, productName: "Teh O Ais (Cup)", expectedQuantity: 150 },
            // Old: { productId: 96, productName: "Farm Fresh UHT Full Cream Milk 200ml", expectedQuantity: 120 },
            // New: FNB-DRK-018,Susu Goodday Full Cream 200ml (Farm fresh not there)
            { productId: findNewIdByOldSku("FNB-DRK-018")!, productName: "Susu Goodday Full Cream 200ml", expectedQuantity: 120 },
        ].filter(item => item.productId !== undefined) as PurchaseOrderItem[]
    },
    { 
        id: 'PO2024003',
        poNumber: 'PO-DEF-003',
        orderDate: '2024-07-22',
        supplierName: 'Runcit Harian Trading',
        status: 'Partially Received',
        items: [
            // Old: { productId: 18, productName: "Gardenia Original Classic 400g", expectedQuantity: 75 },
            // New: FNB-RTG-001,Roti Gardenia Original Classic
            { productId: findNewIdByOldSku("FNB-RTG-001")!, productName: "Roti Gardenia Original Classic", expectedQuantity: 75 },
            // Old: { productId: 150, productName: "Tomato (per kg)", expectedQuantity: 20 },
            // New: New data has no direct tomato per kg. Let's use "Buah Epal Merah" (FNB-FRT-002) as a placeholder fruit.
            { productId: findNewIdByOldSku("FNB-FRT-002")!, productName: "Buah Epal Merah", expectedQuantity: 20 },
        ].filter(item => item.productId !== undefined) as PurchaseOrderItem[]
    }
];

export const mockSupplierInfo: SupplierInfo = {
  tin: "123456789012",
  name: "THEFMSMKT Retail Sdn Bhd",
  address: "Lot 123, Jalan Perniagaan, 50000 Kuala Lumpur, Malaysia",
  businessRegistrationNumber: "202301001234 (123456-A)",
  sstNumber: "S10-1234-56789012",
  msicCode: "47111", 
  email: "sales@thefmsmkt.com",
  phone: "03-12345678"
};

// Remove productSlots from shelves as IDs have changed and remapping is complex for mock.
// Shelf display will rely on product.shelfLocationId and product.currentShelfLocationId.
export const shelfLayoutConfig: ShelfDisplayConfig = {
    layoutName: "Layout Kedai Utama",
    shelves: [
        { id: "SHELF-A", name: "Aisle 1 - Minuman & Tenusu", rows: 2, columns: 3 },
        { id: "SHELF-B", name: "Aisle 2 - Makanan & Snek Ringan", rows: 2, columns: 3 },
        { id: "SHELF-C", name: "Aisle 3 - Roti & Makanan Sedia", rows: 2, columns: 2 },
        { id: "SHELF-D", name: "Aisle 4 - Peralatan Mandian & Kesihatan", rows: 2, columns: 3 },
        { id: "SHELF-E", name: "Aisle 5 - Lain-lain & Tembakau", rows: 1, columns: 4 },
    ]
};

// Update mockProductSets with new product IDs
export let mockProductSets: ProductSet[] = [
  { 
    id: 'set-001', 
    name: 'Pek Sarapan Ringkas', 
    // Kopi O Panas (Cup) + Roti Gardenia Original Classic
    productIds: [findNewIdByOldSku("FNB-DRK-005")!, findNewIdByOldSku("FNB-RTG-001")!].filter(id => id !== undefined) as number[],
    image: '🌅' 
  },
  { 
    id: 'set-002', 
    name: 'Snek Petang Ceria', 
    // Twisties Super Ring Cheese + Milo Ais (Cup)
    productIds: [findNewIdByOldSku("FNB-SNK-001")!, findNewIdByOldSku("FNB-DRK-004")!].filter(id => id !== undefined) as number[],
    image: '🎉' 
  },
  { 
    id: 'set-003',
    name: 'Pencuci Mulut Lazat', 
    // Apollo Chocolate Layer Cake + Susu Goodday Full Cream
    productIds: [findNewIdByOldSku("FNB-RTG-003")!, findNewIdByOldSku("FNB-DRK-018")!].filter(id => id !== undefined) as number[],
    image: '🥳'
  },
];
// Ensure all productIds in sets are valid numbers
mockProductSets.forEach(set => {
    set.productIds = set.productIds.filter(id => typeof id === 'number');
});