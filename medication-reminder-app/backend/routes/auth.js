const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		// Validate request bodyog()
		console.log("Auth")
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}

		// Find user by email
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(401).send({ message: "Invalid Email or Password" });
		}

		// Compare password
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			return res.status(401).send({ message: "Invalid Email or Password" });
		}

		// Generate and return JWT token
		const token = user.generateAuthToken();
		console.log(token)
		res.status(200).send({ token, message: "Logged in successfully" });

	} catch (error) {
		console.error("Login error:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// Input validation
const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;