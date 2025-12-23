export const sliderItems = [
  {
    id: 1,
    img: 'https://blogger.googleusercontent.com/img/a/AVvXsEhaKxOatfH2aNX1cKXk1mt4I_-vy5fLdzL71Y7qAZcay5VwSG6M2sJ9M8Q9e6mmCWmkV-VRehZdG1m_u2DKkAyI7L1BtYjko4iEBfTb_3xVET0rhMU0scEzlp3RZso2WdqKdC2QCu9HpYo_ALti1hEstjgqJ1OE_6_w6iCze9wb_YgKd7fou96ZeG6YIQ=s807',
    title: 'CUISION',
    desc: 'Asian Cuisine includes serral major regional cuisines : Central Asian, East Asian, North Asian, South Asian, Southeast Asian and West Asian . A cuisine is a characteristicstyle of cooking practise and tradition, usually associated with a specific culture. Asia have the Largest Variety and we have some good recipes of that.Hope you enjoy that.',
    bg: 'red',
  },
  {
    id: 2,
    img: 'https://blogger.googleusercontent.com/img/a/AVvXsEg0I1SVj-y4gOZgGFdUnlKU9lgjANF2EusSgVLiXdwy2tIxNBqkscmrwZ0yGUmalicQ0KVHZh26d7dWURu5-fyjKLZB0ervrq_wQwV61OBxsRbbX9NEF0zVC8iHRDDvuR3tajhEhlAA2Gcm-mqHwab5kAmufeXOe5R1leAjkvUm0gQP3W-IOv6dzIF5HA=s16000',
    title: 'CUISION',
    desc: 'Asian Cuisine includes serral major regional cuisines : Central Asian, East Asian, North Asian, South Asian, Southeast Asian and West Asian . A cuisine is a characteristicstyle of cooking practise and tradition, usually associated with a specific culture. Asia have the Largest Variety and we have some good recipes of that.Hope you enjoy that.',
  },
  {
    id: 3,
    img: 'https://image.freepik.com/free-vector/cute-chef-with-grilled-skewered-milk-pork-thai-food-cartoon-illustration_56104-326.jpg',
    title: 'CUISION',
    desc: 'Asian Cuisine includes serral major regional cuisines : Central Asian, East Asian, North Asian, South Asian, Southeast Asian and West Asian . A cuisine is a characteristicstyle of cooking practise and tradition, usually associated with a specific culture. Asia have the Largest Variety and we have some good recipes of that.Hope you enjoy that.',
  },
];

export const categories = [
  {
    id: 1,
    img: 'https://i.pinimg.com/736x/c8/06/a3/c806a37d2bf18a2fffdef36e9d8a1473.jpg',
    title: 'JAPANESE RAMEN',
  },
  {
    id: 2,
    img: 'https://images.pexels.com/photos/6531103/pexels-photo-6531103.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    title: 'SHUSHI FOREVER',
  },
  {
    id: 3,
    img: 'https://www.chopstickchronicles.com/wp-content/uploads/2020/03/Onigiri-2020-update-22-1.jpg',
    title: 'ONIGIRI LOVE',
  },
];

export const popularProducts = [
  {
    id: 1,
    img: '/assets/image/3.png',
  },
  {
    id: 2,
    img: '/assets/image/1.png',
  },
  {
    id: 3,
    img: '/assets/image/2.png',
  },
  {
    id: 4,
    img: '/assets/image/4.png',
  },
  {
    id: 5,
    img: '/assets/image/5.png',
  },
  {
    id: 6,
    img: '/assets/image/7.png',
  },
  {
    id: 7,
    img: '/assets/image/8.png',
  },
  {
    id: 8,
    img: '/assets/image/6.png',
  },
];

// Menu Categories
export const menuCategories = [
  { id: 'starters', name: 'Starters', icon: '🥢' },
  { id: 'ramen', name: 'Ramen', icon: '🍜' },
  { id: 'sushi', name: 'Sushi', icon: '🍣' },
  { id: 'rice-bowls', name: 'Rice Bowls', icon: '🍚' },
  { id: 'desserts', name: 'Desserts', icon: '🍮' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
];

// Menu Items by Category
export const menuItems = {
  starters: [
    {
      id: 1,
      name: 'Edamame',
      description: 'Steamed soybeans with sea salt',
      price: 6.99,
      image: '/assets/image/1.png',
      isVeg: true,
      badges: [],
    },
    {
      id: 2,
      name: 'Gyoza',
      description: 'Pan-fried pork dumplings with dipping sauce',
      price: 8.99,
      image: '/assets/image/2.png',
      isVeg: false,
      badges: ['Bestseller'],
    },
    {
      id: 3,
      name: 'Spring Rolls',
      description: 'Crispy vegetable spring rolls with sweet chili',
      price: 7.99,
      image: '/assets/image/3.png',
      isVeg: true,
      badges: [],
    },
    {
      id: 4,
      name: 'Chicken Karaage',
      description: 'Japanese fried chicken with lemon',
      price: 9.99,
      image: '/assets/image/4.png',
      isVeg: false,
      badges: ['Bestseller'],
    },
  ],
  ramen: [
    {
      id: 5,
      name: 'Tonkotsu Ramen',
      description: 'Rich pork bone broth with chashu and soft-boiled egg',
      price: 14.99,
      image: '/assets/image/5.png',
      isVeg: false,
      badges: ['Bestseller'],
    },
    {
      id: 6,
      name: 'Miso Ramen',
      description: 'Savory miso broth with corn and butter',
      price: 13.99,
      image: '/assets/image/6.png',
      isVeg: false,
      badges: [],
    },
    {
      id: 7,
      name: 'Shoyu Ramen',
      description: 'Classic soy sauce broth with nori and bamboo',
      price: 13.99,
      image: '/assets/image/7.png',
      isVeg: false,
      badges: [],
    },
    {
      id: 8,
      name: 'Vegetarian Ramen',
      description: 'Mushroom and vegetable broth with tofu',
      price: 12.99,
      image: '/assets/image/8.png',
      isVeg: true,
      badges: [],
    },
  ],
  sushi: [
    {
      id: 9,
      name: 'Salmon Sashimi',
      description: 'Fresh Atlantic salmon, 6 pieces',
      price: 16.99,
      image: '/assets/image/1.png',
      isVeg: false,
      badges: ['Bestseller'],
    },
    {
      id: 10,
      name: 'Dragon Roll',
      description: 'Eel, cucumber, avocado, eel sauce',
      price: 15.99,
      image: '/assets/image/2.png',
      isVeg: false,
      badges: [],
    },
    {
      id: 11,
      name: 'California Roll',
      description: 'Crab, avocado, cucumber',
      price: 10.99,
      image: '/assets/image/3.png',
      isVeg: false,
      badges: [],
    },
    {
      id: 12,
      name: 'Vegetable Roll',
      description: 'Assorted fresh vegetables',
      price: 8.99,
      image: '/assets/image/4.png',
      isVeg: true,
      badges: [],
    },
  ],
  'rice-bowls': [
    {
      id: 13,
      name: 'Teriyaki Chicken Bowl',
      description: 'Grilled chicken with teriyaki sauce and vegetables',
      price: 13.99,
      image: '/assets/image/5.png',
      isVeg: false,
      badges: ['Bestseller'],
    },
    {
      id: 14,
      name: 'Beef Bulgogi Bowl',
      description: 'Marinated beef with kimchi and rice',
      price: 14.99,
      image: '/assets/image/6.png',
      isVeg: false,
      badges: [],
    },
    {
      id: 15,
      name: 'Tofu Teriyaki Bowl',
      description: 'Crispy tofu with vegetables and teriyaki',
      price: 11.99,
      image: '/assets/image/7.png',
      isVeg: true,
      badges: [],
    },
  ],
  desserts: [
    {
      id: 16,
      name: 'Mochi Ice Cream',
      description: 'Assorted flavors: green tea, vanilla, strawberry',
      price: 7.99,
      image: '/assets/image/8.png',
      isVeg: true,
      badges: [],
    },
    {
      id: 17,
      name: 'Matcha Tiramisu',
      description: 'Japanese twist on classic tiramisu',
      price: 8.99,
      image: '/assets/image/1.png',
      isVeg: true,
      badges: ['Bestseller'],
    },
    {
      id: 18,
      name: 'Dorayaki',
      description: 'Sweet red bean pancake sandwich',
      price: 6.99,
      image: '/assets/image/2.png',
      isVeg: true,
      badges: [],
    },
  ],
  drinks: [
    {
      id: 19,
      name: 'Matcha Latte',
      description: 'Traditional green tea with steamed milk',
      price: 5.99,
      image: '/assets/image/3.png',
      isVeg: true,
      badges: [],
    },
    {
      id: 20,
      name: 'Yuzu Lemonade',
      description: 'Refreshing Japanese citrus lemonade',
      price: 4.99,
      image: '/assets/image/4.png',
      isVeg: true,
      badges: [],
    },
    {
      id: 21,
      name: 'Sake',
      description: 'Premium Japanese rice wine',
      price: 12.99,
      image: '/assets/image/5.png',
      isVeg: true,
      badges: [],
    },
  ],
};

// Featured dishes for home page
export const featuredDishes = [
  menuItems.ramen[0], // Tonkotsu Ramen
  menuItems.sushi[0], // Salmon Sashimi
  menuItems['rice-bowls'][0], // Teriyaki Chicken Bowl
  menuItems.starters[1], // Gyoza
];
