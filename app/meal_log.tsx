import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function MealLog() {
  const [dayNotes, setDayNotes] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [dayRating, setDayRating] = useState<number>(5);
  const [foodInput, setFoodInput] = useState('');


  // Submit data to Firestore
  const handleSubmit = async () => {
    if (!selectedMeal || !foodInput) {
      Alert.alert('Error', 'Please select a meal type and log your food.');
      return;
    }

    const data = {
      mealType: selectedMeal,
      food: foodInput,
      dayRating,
      notes: dayNotes,
      timestamp: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'logs'), data); 
      console.log('Document written with ID: ', docRef.id);
      Alert.alert('Success', 'Your meal has been logged!');
      
      // Clear the inputs after successful submission
      setSelectedMeal(null);
      setFoodInput('');
      setDayRating(5);
      setDayNotes('');
    } 
    catch (error) {
      console.error('Error logging meal:', error);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Page Title */}
      <ThemedText type="title" style={styles.headerText}>Log Your Meal</ThemedText>

      {/* Meal Type Selector */}
      <View style={styles.mealTypeContainer}>
        {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((meal) => (
          <TouchableOpacity
            key={meal}
            style={[
              styles.mealButton,
              selectedMeal === meal && styles.selectedMealButton,
            ]}
            onPress={() => setSelectedMeal(meal)}
          >
            <Text
              style={[
                styles.mealButtonText,
                selectedMeal === meal && styles.selectedMealButtonText,
              ]}
            >
              {meal}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Food Input Box */}
      <TextInput
        style={styles.inputBox}
        placeholder="What did you eat for this meal or snack? List your foods here."
        value={foodInput}
        onChangeText={setFoodInput}
        multiline
      />

      {/* Day Rating Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>How are you feeling right now?</Text>
        <Text style={styles.sliderLabel}>{dayRating}</Text>

        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabelText}>1: worst</Text>
          <Text style={styles.sliderLabelText}>10: best</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={dayRating}
          onValueChange={(value) => setDayRating(value)}
          minimumTrackTintColor="#1D3D47"
          maximumTrackTintColor="#A1CEDC"
          thumbTintColor="#1D3D47"
        />
      </View>

      {/* Input Text Box */}
      <TextInput
        style={styles.inputBox}
        placeholder="Optional: add any additional notes here"
        value={dayNotes}
        onChangeText={setDayNotes}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Submit</Text>
      </TouchableOpacity>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F4F8',
  },
  headerContainer: {
    width: '100%',
    height: 200, // Adjust the height as needed
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputBox: {
    height: 150,
    borderColor: '#A1CEDC',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#1D3D47',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  mealButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#A1CEDC',
  },
  mealButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D3D47',
  },
  selectedMealButton: {
    backgroundColor: '#1D3D47',
  },
  selectedMealButtonText: {
    color: '#FFFFFF',
  },
  sliderContainer: {
    marginVertical: 20,
    alignItems: 'stretch',
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1D3D47',
  },
});
