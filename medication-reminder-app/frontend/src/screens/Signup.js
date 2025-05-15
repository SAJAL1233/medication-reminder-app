import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import twobackground from '../../assets/twobackground.png';
import { useState } from 'react';
import axios from 'axios';

const Signup = ({ navigation }) => {
	const [data, setData] = useState({
		fullName: '',
		age: '',
		email: '',
		password: '',
		cpassword: '',
	});
	const [error, setError] = useState('');

	const handleChange = (name, value) => {
		setData({ ...data, [name]: value });
	};

	const handleSubmit = async () => {
	// UI validation
	if (!data.fullName || !data.age || !data.email || !data.password || !data.cpassword) {
		setError('Please fill in all fields.');
		return;
	}

	const ageNumber = parseInt(data.age);
	if (isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 120) {
		setError('Please enter a valid age.');
		return;
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(data.email)) {
		setError('Please enter a valid email address.');
		return;
	}

	if (data.password.length < 6) {
		setError('Password must be at least 6 characters.');
		return;
	}

	if (data.password !== data.cpassword) {
		setError('Passwords do not match.');
		return;
	}

	try {
		setError('');
		const url = 'http://192.168.169.218:8080/api/users'; // change if needed
		const { data: res } = await axios.post(url, data);
		console.log(res);
		navigation.navigate('Login');
	} catch (error) {
		if (
			error.response &&
			error.response.status >= 400 &&
			error.response.status <= 500
		) {
			setError(error.response.data.message);
		}
	}
};

	return (
		<View style={styles.container}>
			<Image style={styles.patternbg} source={twobackground} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.container1}>
					<View style={styles.s1}>
						<Text style={styles.h1}>Create New Account</Text>
						<Text style={styles.text}>Create your account</Text>

						<View style={styles.form}>
							<Text style={styles.label}>Full Name</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter your full name"
								value={data.fullName}
								onChangeText={(value) => handleChange('fullName', value)}
							/>

							<Text style={styles.label}>Age</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter your age"
								keyboardType="numeric"
								value={data.age}
								onChangeText={(value) => handleChange('age', value)}
							/>

							<Text style={styles.label}>Email</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter your email"
								keyboardType="email-address"
								autoCapitalize="none"
								value={data.email}
								onChangeText={(value) => handleChange('email', value)}
							/>

							<Text style={styles.label}>Password</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter your password"
								secureTextEntry
								value={data.password}
								onChangeText={(value) => handleChange('password', value)}
							/>

							<Text style={styles.label}>Confirm Password</Text>
							<TextInput
								style={styles.input}
								placeholder="Confirm your password"
								secureTextEntry
								value={data.cpassword}
								onChangeText={(value) => handleChange('cpassword', value)}
							/>

							{error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}

							<View style={styles.buttonContainer}>
								<TouchableOpacity style={styles.button1} onPress={handleSubmit}>
									<Text style={{ color: 'white', textAlign: 'center' }}>Sign Up</Text>
								</TouchableOpacity>

								<Text style={styles.label}>
									Already registered?{' '}
									<Text style={styles.link} onPress={() => navigation.navigate('Login')}>
										Login
									</Text>
								</Text>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default Signup;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		position: 'relative',
	},
	patternbg: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container1: {
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 25,
		padding: 20,
		marginVertical: 20,
	},
	h1: {
		fontSize: 30,
		fontWeight: '800',
		textAlign: 'center',
	},
	text: {
		fontSize: 15,
		fontWeight: '800',
		textAlign: 'center',
	},
	form: {
		width: '100%',
	},
	label: {
		marginTop: 10,
		color: 'teal',
	},
	input: {
		backgroundColor: '#ddead1',
		borderRadius: 15,
		padding: 10,
		marginTop: 5,
		marginBottom: 10,
	},
	buttonContainer: {
		alignItems: 'center',
		marginTop: 20,
	},
	button1: {
		backgroundColor: '#75975e',
		width: '50%',
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 20,
	},
	link: {
		color: '#04471c',
	},
});
