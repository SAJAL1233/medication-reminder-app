const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
const protect = require('../middlewares/auth');

// POST /api/users - Register a new user
router.post("/", async (req, res) => {
	try {
		// Validate user input
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}
        console.log("In Unsers route")
		const { fullName, age, email, password} = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).send({ message: "User with given email already exists!" });
		}

		// // Password match validation
		// if (password !== cpassword) {
		// 	return res.status(400).send({ message: "Passwords do not match" });
		// }

		// Generate salt and hash password
		const saltRounds = Number(process.env.SALT);
		if (isNaN(saltRounds)) {
			throw new Error("Invalid SALT environment variable");
		}
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Save user (excluding cpassword)
		const newUser = new User({ fullName, age, email, password: hashedPassword });
		await newUser.save();

		// Send success response
		res.status(201).send({
			message: "User created successfully",
			user: {
				fullName: newUser.fullName,
				email: newUser.email
			}
		});
	} catch (error) {
		console.error("Signup error:", error.message);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// Optional: GET /api/users?id=USER_ID - Retrieve a specific user's public info
router.get("/", protect, async (req, res) => {console.log(req.user)

  const user = await User.findById(req.user._id).select("fullName email age");
  res.status(200).send(user);
});

module.exports = router;