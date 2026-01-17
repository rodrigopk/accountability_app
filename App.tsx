import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { DeviceInfoProvider, useDeviceInfo } from './src/providers/DeviceInfoProvider';

function AppContent() {
  const { deviceInfo, loading, error } = useDeviceInfo();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading device info...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Device ID:</Text>
      <Text style={styles.deviceId}>{deviceInfo?.id || 'Unknown'}</Text>
      {deviceInfo?.createdAt && (
        <Text style={styles.createdAt}>
          Created: {new Date(deviceInfo.createdAt).toLocaleString()}
        </Text>
      )}
    </View>
  );
}

function App() {
  return (
    <DeviceInfoProvider>
      <AppContent />
    </DeviceInfoProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  deviceId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  createdAt: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
  },
});

export default App;
