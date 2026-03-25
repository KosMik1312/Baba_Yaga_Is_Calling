import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useTranslation } from 'react-i18next';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { t, i18n } = useTranslation();

  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [parentPin, setParentPin] = useState('');

  const handleSave = () => {
    // Здесь будет сохранение в store или API
    Alert.alert(t('common.success'), t('settings.saved'));
    navigation.goBack();
  };

  const handleChangeLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Родительский контроль */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.parent_control')}</Text>
          <TextInput
            style={styles.input}
            placeholder="PIN код"
            placeholderTextColor="#999"
            value={parentPin}
            onChangeText={setParentPin}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        {/* Настройки ребёнка */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация о ребёнке</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>{t('settings.child_name')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('settings.child_name')}
              placeholderTextColor="#999"
              value={childName}
              onChangeText={setChildName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('settings.child_age')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('settings.child_age')}
              placeholderTextColor="#999"
              value={childAge}
              onChangeText={setChildAge}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        {/* Язык */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={handleChangeLanguage}
          >
            <Text style={styles.languageText}>
              {i18n.language === 'ru' ? 'Русский' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Кнопка сохранения */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>{t('settings.save')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    elevation: 3,
    ...Platform.select({
      web: { boxShadow: '0px 2px 2px rgba(0,0,0,0.1)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#8B4513',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    ...Platform.select({
      web: { boxShadow: '0px 1px 2px rgba(0,0,0,0.1)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  languageButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  languageText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    ...Platform.select({
      web: { boxShadow: '0px 2px 3px rgba(0,0,0,0.2)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
    }),
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
