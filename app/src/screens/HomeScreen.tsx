import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

const CHARACTERS = [
  {
    id: 'baba_yaga',
    name: 'Баба Яга',
    description: 'Волшебница из сказок',
    isFree: true,
    avatar: require('@assets/characters/baba_yaga.png'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Баба Яга Звонит</Text>
        <Text style={styles.subtitle}>Выберите персонажа:</Text>

        {CHARACTERS.map(character => (
          <TouchableOpacity
            key={character.id}
            style={styles.card}
            onPress={() => navigation.navigate('Call', { characterId: character.id })}
            activeOpacity={0.7}
          >
            <Image source={character.avatar} style={styles.avatar} resizeMode="cover" />
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterDesc}>{character.description}</Text>
            {character.isFree && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>Бесплатно</Text>
              </View>
            )}
            <View style={styles.callButton}>
              <Text style={styles.callButtonText}>Позвонить</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD700' },
  content: { padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#8B4513', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#8B4513', marginBottom: 24, fontWeight: '600' },
  card: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20,
    alignItems: 'center', marginBottom: 20,
    elevation: 5, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,
  },
  avatar: { width: 150, height: 150, borderRadius: 75, marginBottom: 12 },
  characterName: { fontSize: 24, fontWeight: 'bold', color: '#8B4513', marginBottom: 4 },
  characterDesc: { fontSize: 16, color: '#666', marginBottom: 12 },
  freeBadge: {
    backgroundColor: '#4CAF50', paddingHorizontal: 16,
    paddingVertical: 6, borderRadius: 12, marginBottom: 12,
  },
  freeBadgeText: { color: '#FFF', fontWeight: 'bold' },
  callButton: {
    backgroundColor: '#FF6B6B', paddingHorizontal: 40,
    paddingVertical: 12, borderRadius: 25,
  },
  callButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
