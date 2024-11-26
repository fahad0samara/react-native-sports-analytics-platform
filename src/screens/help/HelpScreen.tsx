import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I get started?',
    answer: 'Complete your profile, set your fitness goals, and start tracking your workouts. Our AI-powered analytics will help you improve your performance.',
  },
  {
    question: 'How does the analytics work?',
    answer: 'Our platform uses advanced AI algorithms to analyze your performance data, identify patterns, and provide personalized recommendations for improvement.',
  },
  {
    question: 'Can I track multiple sports?',
    answer: 'Yes! Our platform supports multiple sports and activities. You can switch between different sports and track your progress for each one.',
  },
  {
    question: 'How accurate is the tracking?',
    answer: 'Our tracking system uses state-of-the-art sensors and algorithms to provide highly accurate measurements of your performance metrics.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security seriously. All your data is encrypted and stored securely following industry best practices.',
  },
];

const SUPPORT_OPTIONS = [
  {
    icon: 'mail-outline',
    title: 'Email Support',
    description: 'Get help via email',
    action: () => Linking.openURL('mailto:support@sportsanalytics.com'),
  },
  {
    icon: 'chatbubbles-outline',
    title: 'Live Chat',
    description: 'Chat with our support team',
    action: () => {/* Implement live chat */},
  },
  {
    icon: 'call-outline',
    title: 'Phone Support',
    description: 'Call our support team',
    action: () => Linking.openURL('tel:+1234567890'),
  },
];

export default function HelpScreen() {
  const navigation = useNavigation();
  const [expandedFAQ, setExpandedFAQ] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.light} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <GlassmorphicCard style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Support</Text>
            <View style={styles.supportOptions}>
              {SUPPORT_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.supportOption}
                  onPress={option.action}
                >
                  <View style={styles.supportIconContainer}>
                    <Ionicons name={option.icon} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.supportContent}>
                    <Text style={styles.supportTitle}>{option.title}</Text>
                    <Text style={styles.supportDescription}>{option.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              ))}
            </View>
          </GlassmorphicCard>

          <GlassmorphicCard style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {FAQ_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faqItem}
                onPress={() => toggleFAQ(index)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons
                    name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={colors.text.secondary}
                  />
                </View>
                {expandedFAQ === index && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </GlassmorphicCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  supportOptions: {
    gap: 12,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  supportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  faqItem: {
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.text.secondary,
    padding: 16,
    paddingTop: 0,
  },
});
