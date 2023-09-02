
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image, ImageBackground,SafeAreaView,TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator()

export default function App(){
  return (
   


    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen component={Main} name='Main' />
        <Stack.Screen component={Home} name='Home' />
      </Stack.Navigator>
    </NavigationContainer>

  )
}

function Main({navigation}) {
  return (
    <ImageBackground source={require('./assets/images/sky.jpg') } resizeMode='cover' style={{flex:1}} imageStyle={{ opacity: 0.5 }} >
    <SafeAreaView style={styles.safeContainer1}>
      
      <View >
        <Text style={styles.topText}>FRONT-PAGE</Text>
      </View>
      <TouchableOpacity onPress={()=> navigation.navigate('Home')} style={styles.bottomButton} >
        <Text style={styles.buttontext} > Let's Begin </Text>
      </TouchableOpacity>
      
    </SafeAreaView>
    </ImageBackground>
  );
}

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "969975139159-mcq96r2a3uhqjb87iejd9c4l6iqlook5.apps.googleusercontent.com"
  })

  useEffect(() => { handleSignIn() }, [response])

  async function handleSignIn() // checks if we've a user locally
  {
    const user = await AsyncStorage.getItem("@user")
    if (!user) {
      if (response?.type === "success") { await getUserInfo(response.authentication.accessToken) }
    } else {
      setUserInfo(JSON.parse(user))
    }
  }

  const getUserInfo = async (token) => {

    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      const user = await response.json()
      await AsyncStorage.setItem("@user", JSON.stringify(user))
      setUserInfo(user)
    } catch (error) {

    }
  }

  return (
    <ImageBackground source={require("./assets/images/googleSplash.jpg")} resizeMode="cover" style={{ flex: 1 }} imageStyle={{ opacity: 0.5 }}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <Text style={styles.titleTop}>Musedaq Authentication</Text>
          <View style={styles.buttonContainer}>
          <Text style={styles.userInfo}>User info : {JSON.stringify(userInfo)}</Text>
            <Button title="Google Sign-In" onPress={() => promptAsync()} style={styles.button} />
            <View style={styles.buttonSeparator} />
            <Button title="Remove Current User" onPress={async () => await AsyncStorage.removeItem("@user")} style={styles.button} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  topText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#20315f'
  },
  bottomButton : {
    padding: 20,
    width : '90%',
    backgroundColor: '#AD40Af',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttontext: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  safeContainer1: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },titleTop: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 40,
    borderRadius: 10, 
    padding: 10, // Add some padding for better appearance
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 400, // Adjust the gap between buttons
    alignItems: "center",
    borderRadius:10
  },
  button: {
    width: 200,
    backgroundColor: "#9288F8",
    marginBottom: 20, // Adjust the space between buttons
  },
  buttonSeparator: {
    height: 20, // Margin gap between buttons
  },
  safeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
