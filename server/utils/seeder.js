const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Reward = require('../models/Reward');

dotenv.config({ path: './server/.env' });

const rewards = [
  {
    name: 'Amazon e-Gift Card',
    description: 'Redeem for millions of items on Amazon.com. Perfect for sustainable household items!',
    pointsRequired: 500,
    brand: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    category: 'Shopping',
  },
  {
    name: 'Starbucks Refreshers',
    description: 'Get a free grande refresher at any Starbucks outlet. Skip the cup and use your own!',
    pointsRequired: 250,
    brand: 'Starbucks',
    logo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg',
    category: 'Food',
  },
  {
    name: 'Uber Green Ride',
    description: 'Save $10 on your next Uber Green (EV) trip. Reduce emissions on the go!',
    pointsRequired: 350,
    brand: 'Uber',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    category: 'Travel',
  },
  {
    name: 'Patagonia Discount',
    description: '20% off on your next purchase of sustainable outdoor gear.',
    pointsRequired: 800,
    brand: 'Patagonia',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6s7p0oQ_tNfVzPZZl-n_S9FfC-7V-vG0VvA&s',
    category: 'Shopping',
  },
  {
    name: 'Netflix Sustainable Docs',
    description: '1 month subscription to watch the best environmental documentaries.',
    pointsRequired: 1000,
    brand: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    category: 'Entertainment',
  }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');
        
        // Clear existing rewards
        await Reward.deleteMany();
        console.log('Cleared old rewards.');

        await Reward.insertMany(rewards);
        console.log('Successfully seeded rewards!');
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
