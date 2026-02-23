const jwt = require('jsonwebtoken');
const { User } = require('./utils/store');

async function testAuth() {
    process.env.JWT_SECRET = 'test_secret';

    // Register mock
    const user = await User.create({
        name: 'test',
        email: 'test@test.com',
        password: 'password'
    });

    console.log("Created User:", user);

    // Token mock
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("Generated Token Payload:", jwt.decode(token));

    // Verify mock
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded ID:", decoded.id);

    const fetchedUser = await User.findById(decoded.id);
    console.log("Fetched User from Store:", fetchedUser);

    if (fetchedUser === null) {
        console.error("BUG CONFIRMED: User.findById returns null");
    } else {
        console.log("Store fetched user successfully.");
    }
}

testAuth();
