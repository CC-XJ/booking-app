import { Text, View } from '@/components/Themed';
import { Dynatrace } from '@dynatrace/react-native-plugin';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import profileStyles from '../../constants/styles/profileStyles';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const [loading, setLoading ] = useState(true);
  const [profile, setProfile ] = useState<{email: String, id: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, [])

  async function getProfile() {
    try{
      setLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if(authError) throw authError;

      if(user){
        const { data, error, status } = await supabase
          .from('profiles')
          .select('email, id')
          .eq('id', user.id)
          .single();

        if (error && status !== 406){
          throw error;
        }

        if (data){
          setProfile(data);
        }
      }
    } catch (error: any){
      Alert.alert('Error', error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error signing out', error.message);
      console.log(error.message);

    } else {
      console.log('Signed out successfullly');
      router.replace('/(auth)/signin');
    }
  }

  if (loading){
    return(
      <View style={profileStyles.container}>
        <ActivityIndicator size = "large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.profileCard}>
        <Text style={profileStyles.label}>Email</Text>
        <Text style={profileStyles.infoText}>{profile?.email ?? 'No email found'}</Text>
        
        <Text style={profileStyles.label}>User ID</Text>
        <Text style={profileStyles.infoTextSmall}>{profile?.id}</Text>
      </View>

      <TouchableOpacity 
        style={profileStyles.signOutButton} 
        onPress={() => {
          Alert.alert(
            "Sign Out",
            "Are you sure you want to log out?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Sign Out", onPress: signOut, style: 'destructive' }
            ]
          );

          // End current DT session
          Dynatrace.endSession;
        }}
      >
        <Text style={profileStyles.signOutText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={profileStyles.errorButton}
        onPress={() => {
          try{
            throw new Error("Test Dynatrace Error monitoring");
          } catch (error: any){

            Dynatrace.reportError("Test Dynatrace Error Monitoring", 1001);
            
            Alert.alert("Notice", "An error occured");
          }
        }}>
          <Text style={profileStyles.errorText}>Error</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={profileStyles.errorButton}
        onPress={() => {
            throw new Error("Test Dynatrace Crash monitoring");
        }}>
          <Text style={profileStyles.errorText}>Crash</Text>
      </TouchableOpacity>
    </View>
  );
}
