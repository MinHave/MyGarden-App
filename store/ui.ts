import AsyncStorage from "@react-native-async-storage/async-storage";

const ui = {
  currentCalendarDay: 0, // Assuming this should be a number, provide a default value
  updateUI: false,
  updateUICallback: (value: boolean) => {}, // Initialize with a no-op function

  scrollEnabled: true,
  scrollEnabledCallback: (value: boolean) => {}, // Initialize with a no-op function

  async getScrollEnabled() {
    return this.scrollEnabled;
  },

  async setScrollEnabled(value: boolean) {
    this.scrollEnabled = value; // Ensure the internal state is updated
    this.scrollEnabledCallback(value);
  },

  async getUpdateUI() {
    return this.updateUI;
  },

  async setUpdateUI(value: boolean) {
    this.updateUI = value; // Ensure the internal state is updated
    this.updateUICallback(value);
  },
};

export default ui;
