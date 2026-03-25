import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { CHARACTERS } from '@utils/constants';
import { useTranslation } from 'react-i18next';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();

  const handleCallCharacter = (characterId: string) => {
    navigation.navigate('Call', { characterId });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('app.title')}</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>{t('home.choose_character')}</Text>

      <View style={styles.charactersList}>
        {Object.values(CHARACTERS).map((character) => (
          <TouchableOpacity
            key={character.id}
            style={styles.characterCard}
            onPress={() => handleCallCharacter(character.id)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <Image 
                source={character.avatar} 
                style={styles.characterAvatar}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterDescription}>{character.description}</Text>
            {character.isFree && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>{t('common.free')}</Text>
              </View>
            )}
            <View style={styles.callButton}>
              <Text style={styles.callButtonText}>{t('common.call')}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    ...Platform.select({
      web: { boxShadow: '0px 2px 2px rgba(0,0,0,0.1)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
    }),
  },
  settingsButtonText: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 20,
    color: '#8B4513',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  charactersList: {
    gap: 20,
  },
  characterCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    ...Platform.select({
      web: { boxShadow: '0px 2px 3.84px rgba(0,0,0,0.25)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
    }),
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  characterAvatar: {
    width: '100%',
    height: '100%',
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 5,
  },
  characterDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  freeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 5,
  },
  freeBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  callButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    elevation: 3,
    ...Platform.select({
      web: { boxShadow: '0px 1px 1.5px rgba(0,0,0,0.2)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.5 },
    }),
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
