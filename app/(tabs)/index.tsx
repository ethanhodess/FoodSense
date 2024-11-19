import { Image, StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#709dbe', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/food_plate.jpg')}
          style={styles.headerImage}
        />
      }>
      <ScrollView style={styles.container}>
        
        {/* Welcome Header */}
        <ThemedView style={styles.welcomeContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
        </ThemedView>

        {/* Side-by-Side Log Meal and Meal History Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/meal_log" style={styles.button}>
            <Text style={styles.buttonText}>    Log Meal</Text>
          </Link>
          <Link href="/meal-history" style={styles.button}>
            <Text style={styles.buttonText}>  Meal History</Text>
          </Link>
        </View>

      </ScrollView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '65%',
    height: 290, // Adjust height to control the display size
  },
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  // Container for the side-by-side buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  // Style for each button
  button: {
    flex: 1,
    backgroundColor: '#1D3D47',
    paddingVertical: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
  },
  // Text style for the button text
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
