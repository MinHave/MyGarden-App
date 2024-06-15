import AsyncStorage from '@react-native-async-storage/async-storage';

const ui = {
  updateUI: false,
  // Other properties...
  updateUICallback: (value: boolean) => {}, // Placeholder for the callback function

  setUpdateUI(value: boolean) {
    console.log('UI Updated');
    this.updateUI = value; // Update the internal state
    this.updateUICallback(value); // Call the callback function
  },

  // Register a callback function
  registerUpdateUICallback(callback: (value: boolean) => void) {
    this.updateUICallback = callback;
  },
};

export default ui;
