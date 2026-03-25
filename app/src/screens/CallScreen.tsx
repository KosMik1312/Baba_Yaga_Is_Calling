import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CallScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.characterContainer}>
        <Image
          source={require('@assets/characters/baba_yaga.png')}
          style={styles.characterImage}
          resizeMode="cover"
        />
        <Text style={styles.characterName}>Баба Яга</Text>
        <Text style={styles.statusText}>Нажми чтобы говорить</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.micButton} activeOpacity={0.7}>
          <Text style={styles.micButtonText}>🎤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.endCallButtonText}>📴 Завершить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  characterContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  characterImage: {
    width: 280, height: 350, borderRadius: 20,
    borderWidth: 5, borderColor: '#FFD700',
  },
  characterName: {
    fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 16,
  },
  statusText: { fontSize: 16, color: '#FFD700', marginTop: 8 },
  controls: {
    paddingBottom: 40, alignItems: 'center', gap: 16,
  },
  micButton: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center',
    elevation: 5,
  },
  micButtonText: { fontSize: 36 },
  endCallButton: {
    backgroundColor: '#F44336', paddingHorizontal: 40,
    paddingVertical: 14, borderRadius: 30,
  },
  endCallButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
