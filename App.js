import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';

WebBrowser.maybeCompleteAuthSession();

export default function App() {

  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      webClientId: "963963235675-6nf67n24tnu2mpe3c18j3ghct7c9iavd.apps.googleusercontent.com",
      iosClientId: "963963235675-07k9f4bv0b6rh1j4e6qnv10bcs0bkeic.apps.googleusercontent.com",
      androidClientId: "963963235675-uce9b057c8u17e0i3e3f7vv6eegmmbk6.apps.googleusercontent.com"
    });

    React.useEffect(()=>{
      handleSignInWithGoogle();

    }, [response])

    async function handleSignInWithGoogle() {
      const user= await AsyncStorage.getItem("@user");
      if(!user){
        if(response?.type==="success")
        {
          await getUserInfo(response.authentication.accessToken);
        }

      } else 
      {
        setUserInfo(JSON.parse(user));
      }
    }

    const getUserInfo = async (token) => {
      if(!token) return;
      try {
        const response = await fetch("https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {Authorization:`Bearer ${token}`},
        });

        const user = await response.json();
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        setUserInfo(user);
        
      } catch (error) {
        
      }
    }
  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo)}</Text>
      <Text>Welcome Guys</Text>
      <Button title="Sign in with Google" onPress={promptAsync}></Button>
      <Button title="Delete Local Storage" onPress={()=> AsyncStorage.removeItem("@user")}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
