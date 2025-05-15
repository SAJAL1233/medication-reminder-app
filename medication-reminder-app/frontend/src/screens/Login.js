import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import twobackground from '../../assets/twobackground.png';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSubmit = async () => {
    if (!data.email || !data.password) {
      setError('Both fields are required');
      return;
    }

    if (!validateEmail(data.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const url = 'http://192.168.169.218:8080/api/auth'; // Adjust IP as needed
      const response = await axios.post(url, data);
      console.log(response.data.token)
      // Save token or user data if returned from backend
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }

      setError('');
      navigation.navigate('Home');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.patternbg} source={twobackground} />
      <View style={styles.container1}>
        <View style={styles.s1}>
          <Text style={styles.h1}>LogIn</Text>
          <Text style={styles.text}>Sign in to continue</Text>

          <View style={styles.form}>
            {error !== '' && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              onChangeText={(text) => handleChange('email', text)}
              value={data.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={(text) => handleChange('password', text)}
              value={data.password}
            />

            <Text style={styles.label}>Forgot Password?</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button1} onPress={handleSubmit}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
              </TouchableOpacity>

              <Text style={styles.label}>
                Don't have an account?{' '}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('Signup')}
                >
                  SignUp
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  patternbg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  s1: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});