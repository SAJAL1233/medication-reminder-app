const mongoose = require("mongoose");

module.exports = async () => {
	try {
		await mongoose.connect(process.env.DB);
		console.log("✅ Connected to MongoDB Atlas");
	} catch (err) {
		console.error("❌ MongoDB connection failed");
		console.error(err.message || err);
	}
};
