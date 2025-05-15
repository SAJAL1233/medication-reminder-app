import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import frontbackground from '../../assets/frontbackground.png'

const Welcome = ({navigation}) => {


  return (
    <View style={styles.container}>
      <Image style={styles.patternbg} source={frontbackground}/>
      <View style={styles.container1}>

        <Text style={styles.button1}
        onPress={()=>navigation.navigate('Login')}
        >Login</Text>
        <Text style={styles.button1}
         onPress={()=>navigation.navigate('Signup')}
        >SignUp</Text>
      
      </View>
      
    </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%',
  },
  patternbg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  container1:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:'100%',
    gap:10
  },
  button1:{
    backgroundColor: '#75975e',
    color: 'white',
    top: 125,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
})