const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uap');
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@uap.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`Admin user already exists with email: ${adminEmail}.`);
            // Update password just in case it was changed and the user forgot
            const salt = await bcrypt.genSalt(10);
            existingAdmin.password = await bcrypt.hash('admin123', salt);
            existingAdmin.role = 'Admin';
            await existingAdmin.save();
            console.log('Admin password reset to: admin123');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'Admin'
            });

            console.log(`Successfully created admin user with email: ${adminEmail} and password: admin123`);
        }
    } catch (err) {
        console.error('Error creating admin user:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit();
    }
};

createAdmin();
