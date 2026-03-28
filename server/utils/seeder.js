const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Reward = require('../models/Reward');
const User = require('../models/User');
const Activity = require('../models/Activity');
const bcrypt = require('bcryptjs');

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
        
        // 1. Clear existing data
        await Reward.deleteMany();
        await User.deleteMany();
        await Activity.deleteMany();
        console.log('Cleared old data.');

        // 2. Seed Rewards
        await Reward.insertMany(rewards);
        console.log('Seeded rewards.');

        // 3. Seed Users (Global Elite)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            { username: 'EcoWarrior', email: 'warrior@eco.com', password: hashedPassword, points: 5200, carbonFootprint: 1420.5, trustScore: 98 },
            { username: 'GreenBean', email: 'bean@eco.com', password: hashedPassword, points: 3100, carbonFootprint: 980.2, trustScore: 95 },
            { username: 'PlanetSaver', email: 'saver@eco.com', password: hashedPassword, points: 2850, carbonFootprint: 850.0, trustScore: 92 },
            { username: 'NatureLover', email: 'lover@eco.com', password: hashedPassword, points: 1900, carbonFootprint: 640.8, trustScore: 88 },
            { username: 'TreeHugger', email: 'hugger@eco.com', password: hashedPassword, points: 1200, carbonFootprint: 410.3, trustScore: 90 },
            { username: 'CarbonCutter', email: 'cutter@eco.com', password: hashedPassword, points: 800, carbonFootprint: 250.5, trustScore: 85 }
        ];

        const createdUsers = await User.insertMany(users);
        console.log('Seeded users.');

        // 4. Seed Activities for the top user to populate charts
        const warrior = createdUsers[0];
        const pastActivities = [];
        const activityTypes = ['Walking', 'Cycling', 'Public Transport'];
        
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
            const distance = Math.random() * 10 + 1;
            
            let co2Saved = 0;
            let points = 0;
            if (type === 'Walking') { co2Saved = distance * 0.15; points = Math.floor(distance * 12); }
            else if (type === 'Cycling') { co2Saved = distance * 0.25; points = Math.floor(distance * 20); }
            else { co2Saved = distance * 0.08; points = Math.floor(distance * 5); }

            pastActivities.push({
                user: warrior._id,
                activityType: type,
                distance: distance,
                duration: distance * 10,
                co2Saved,
                points,
                trustScore: 100,
                createdAt: date
            });
        }

        await Activity.insertMany(pastActivities);
        console.log('Seeded activity history.');

        console.log('Database successfully seeded with real-world test data!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();

