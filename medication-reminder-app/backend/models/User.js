const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// User Schema
const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	age: { type: Number, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// Generate JWT
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, email: this.email },
		process.env.JWTPRIVATEKEY,
		{ expiresIn: "7d" }
	);
	return token;
};

const User = mongoose.model("user", userSchema);

// Joi Validation with password === cpassword check
const validate = (data) => {
	const schema = Joi.object({
		fullName: Joi.string().required().label("Full Name"),
		age: Joi.number().required().label("Age"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		cpassword: Joi.any()
			.valid(Joi.ref("password"))
			.required()
			.label("Confirm password")
			.messages({ "any.only": "{{#label}} does not match Password" }),
	});
	return schema.validate(data);
};

module.exports = { User, validate };