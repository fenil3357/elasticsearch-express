import axios from "axios";

// Categories and Tags to Randomize
const categories = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports", "Automobile"];
const productNames = {
    "Electronics": [
        "Apple iPhone 14 Pro Max",
        "Samsung Galaxy S23 Ultra",
        "Sony WH-1000XM5 Headphones",
        "Google Nest Smart Speaker",
        "DJI Phantom 4 Pro Drone",
        "Bose QuietComfort Earbuds",
        "ASUS ROG Zephyrus Gaming Laptop",
        "Canon PowerShot G7X Camera",
        "GoPro Hero 11 Black",
        "HP Pavilion x360 Laptop",
        "Logitech MX Master 3 Mouse",
        "Microsoft Surface Pro 9 Tablet",
        "Razer BlackWidow Mechanical Keyboard",
        "Anker Soundcore Bluetooth Speaker",
        "Xiaomi Redmi Note 12 Pro"
    ],
    "Fashion": [
        "Nike Air Force 1 Sneakers",
        "Adidas Ultraboost Running Shoes",
        "Puma Suede Classic Sneakers",
        "Gucci Marmont Shoulder Bag",
        "Ray-Ban Wayfarer Sunglasses",
        "Levi's 501 Original Jeans",
        "H&M Oversized Cotton Hoodie",
        "Zara Checked Blazer",
        "North Face Apex Flex Jacket",
        "Rolex Oyster Perpetual Watch",
        "Calvin Klein Slim Fit T-Shirt",
        "Uniqlo Heattech Thermal Leggings",
        "Tommy Hilfiger Polo Shirt",
        "Patagonia Down Sweater Vest",
        "Balenciaga Triple S Sneakers"
    ],
    "Home & Kitchen": [
        "Dyson V15 Detect Vacuum Cleaner",
        "Hitachi Refrigerator Double Door",
        "Samsung 8KG Front Load Washing Machine",
        "Ikea LACK Coffee Table",
        "Philips Viva Collection Air Fryer",
        "Prestige Induction Cooktop",
        "LG Convection Microwave Oven",
        "Cuisinart 14-Cup Food Processor",
        "KitchenAid Artisan Stand Mixer",
        "Panasonic Automatic Bread Maker",
        "Bosch Freestanding Dishwasher",
        "Tupperware Eco Water Bottle Set",
        "Whirlpool Side-by-Side Refrigerator",
        "Häfele Built-In Oven",
        "Smeg Retro Style Electric Kettle"
    ],
    "Books": [
        "Harry Potter and the Philosopher's Stone",
        "The Lord of the Rings: The Two Towers",
        "Atomic Habits by James Clear",
        "The Subtle Art of Not Giving a F*ck",
        "Becoming by Michelle Obama",
        "A Song of Ice and Fire: A Game of Thrones",
        "To Kill a Mockingbird by Harper Lee",
        "The Great Gatsby by F. Scott Fitzgerald",
        "1984 by George Orwell",
        "Sapiens: A Brief History of Humankind",
        "Educated by Tara Westover",
        "The Catcher in the Rye by J.D. Salinger",
        "The Alchemist by Paulo Coelho",
        "Think and Grow Rich by Napoleon Hill",
        "Rich Dad Poor Dad by Robert Kiyosaki"
    ],
    "Sports": [
        "Yonex Nanoray 10F Badminton Racket",
        "Spalding NBA Official Basketball",
        "Nike Phantom GT Soccer Shoes",
        "Adidas Predator Edge Cleats",
        "Wilson Pro Staff Tennis Racket",
        "Puma NRGY Running Shoes",
        "Decathlon Domyos Foldable Exercise Bike",
        "Under Armour Speed Pocket Running Shorts",
        "Garmin Forerunner 255 Smartwatch",
        "Fitbit Charge 5 Fitness Tracker",
        "Head Tour Pro Tennis Balls",
        "Reebok Resistance Bands Set",
        "Everlast Leather Boxing Gloves",
        "Salomon Speedcross 5 Trail Running Shoes",
        "Suunto Core Outdoor Sports Watch"
    ],
    "Automobile": [
        "Toyota Corolla Altis Sedan",
        "Honda Civic Hybrid Car",
        "Tesla Model S Plaid Electric Car",
        "Ford Mustang GT Convertible",
        "Chevrolet Silverado 1500 Pickup",
        "Kawasaki Ninja ZX-10R Superbike",
        "Yamaha YZF-R15 Sports Bike",
        "BMW X5 M Sports Utility Vehicle",
        "Audi Q7 Luxury SUV",
        "Harley-Davidson Iron 883 Cruiser Bike",
        "Michelin Primacy 4 Car Tyres",
        "Castrol GTX Engine Oil",
        "Bosch Spark Plugs Set",
        "Pioneer Touchscreen Car Stereo",
        "Hella LED Fog Lights"
    ]
};

// Function to Generate Random Latitude and Longitude as GeoJSON
const randomLatLon = () => ({
    type: "Point",
    coordinates: [
        parseFloat((Math.random() * 360 - 180).toFixed(6)), // Longitude between -180 and 180
        parseFloat((Math.random() * 180 - 90).toFixed(6))   // Latitude between -90 and 90
    ]
});

// Function to Generate Random Product
const generateProduct = (id) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = productNames[category][Math.floor(Math.random() * productNames[category].length)];
    return {
        id,
        name,
        description: `The ${name} is a premium offering in the ${category} category, designed with cutting-edge features to exceed expectations.`,
        price: (Math.random() * 1000).toFixed(2), // Random price between 0 and 1000
        category,
        tags: productNames[category].slice(0, Math.floor(Math.random() * productNames[category].length) + 1),
        inStock: Math.random() > 0.3, // 70% chance of being in stock
        rating: (Math.random() * 5).toFixed(1), // Random rating between 0.0 and 5.0
        location: randomLatLon(),
        quantity: (Math.random() * 1000).toFixed(0)
    };
};

// Function to Bulk Index Products to the API
const bulkIndexProducts = async (products) => {
    try {
        const response = await axios.post('http://localhost:3030/api/products/bulk-index', products, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('Bulk index success:', response.data);
    } catch (error) {
        console.log("🚀 ~ bulkIndexProducts ~ error:", error)
        console.error('Bulk index failed:', error.response ? error.response.data : error.message);
    }
};

// Generate 20,000 Unique Products
const products = [];
for (let i = 1; i <= 50000; i++) {
    products.push(generateProduct(i));
}

// Bulk Index Products
bulkIndexProducts(products);
