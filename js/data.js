/* ==========================================
   js/data.js — Products & initial data
   ========================================== */

const CATEGORIES = ["All","Electronics","Clothing","Footwear","Home & Kitchen","Sports","Books"];

const INIT_PRODUCTS = [
  { product_id:"p1",  name:"Samsung Galaxy A54",         description:"6.4-inch Super AMOLED, 5000mAh battery, 128GB storage, IP67 water resistant",         price:35999,  stock_quantity:45,  category:"Electronics",    image_url:"📱", rating:4.5, reviews:128 },
  { product_id:"p2",  name:"Apple AirPods Pro (2nd Gen)", description:"Active noise cancellation, Spatial Audio, USB-C charging, 30hr total battery",          price:28999,  stock_quantity:20,  category:"Electronics",    image_url:"🎧", rating:4.8, reviews:256 },
  { product_id:"p3",  name:"Nike Air Max 270",            description:"Lightweight running shoes, breathable mesh upper, Max Air heel unit for all-day comfort", price:8999,   stock_quantity:60,  category:"Footwear",       image_url:"👟", rating:4.3, reviews:89  },
  { product_id:"p4",  name:"Levi's 511 Slim Fit Jeans",  description:"Classic 5-pocket styling, premium stretch denim, sits below waist",                     price:3499,   stock_quantity:80,  category:"Clothing",       image_url:"👖", rating:4.1, reviews:42  },
  { product_id:"p5",  name:"Prestige Rice Cooker 1.8L",  description:"Auto-cook & keep warm function, non-stick inner pot, 3-in-1 use",                        price:2999,   stock_quantity:35,  category:"Home & Kitchen", image_url:"🍚", rating:4.6, reviews:315 },
  { product_id:"p6",  name:"HP Pavilion 15 Laptop",      description:"Intel Core i5-12th Gen, 8GB DDR4 RAM, 512GB NVMe SSD, Windows 11 Home",                  price:62999,  stock_quantity:15,  category:"Electronics",    image_url:"💻", rating:4.4, reviews:67  },
  { product_id:"p7",  name:"ON Whey Protein 2kg",        description:"24g protein per serving, 5.5g BCAAs, chocolate fudge brownie flavor",                    price:4499,   stock_quantity:55,  category:"Sports",         image_url:"🏋️", rating:4.7, reviews:203 },
  { product_id:"p8",  name:"Atomic Habits — James Clear", description:"An easy and proven way to build good habits and break bad ones. #1 NYT Bestseller",     price:599,    stock_quantity:100, category:"Books",          image_url:"📚", rating:4.9, reviews:512 },
  { product_id:"p9",  name:"Sony WH-1000XM5",            description:"Industry-leading noise canceling, 30hr battery, Speak-to-Chat, multipoint connect",      price:39999,  stock_quantity:12,  category:"Electronics",    image_url:"🎵", rating:4.8, reviews:178 },
  { product_id:"p10", name:"Fitness Yoga Mat 6mm",       description:"Non-slip TPE surface, eco-friendly, includes carry strap, 183×61cm",                     price:1299,   stock_quantity:75,  category:"Sports",         image_url:"🧘", rating:4.2, reviews:94  },
  { product_id:"p11", name:"Jamdani Cotton Kurti",       description:"Authentic Bangladeshi handwoven cotton, printed motifs, regular fit",                    price:1799,   stock_quantity:90,  category:"Clothing",       image_url:"👗", rating:4.0, reviews:61  },
  { product_id:"p12", name:"Philips Pro Blender 1000W",  description:"6-blade ProBlend technology, 1.5L jar, 3 speeds + pulse, BPA-free",                     price:3999,   stock_quantity:28,  category:"Home & Kitchen", image_url:"🫙", rating:4.5, reviews:147 },
];

const ADMIN_USER = {
  customer_id:   "admin_001",
  name:          "Admin User",
  email:         "admin@shopbd.com",
  password_hash: btoa("admin123" + "_salt_bd"),
  phone:         "01700000000",
  address:       "Motijheel, Dhaka 1000",
  role:          "admin",
};
