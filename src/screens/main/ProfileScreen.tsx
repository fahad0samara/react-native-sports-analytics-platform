import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const dummyUser = {
  username: 'John Doe',
  email: 'john.doe@example.com',
  predictionAccuracy: 85,
  totalPredictions: 124,
  winningStreak: 12,
  memberSince: '2024-01-01',
};

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <GlassmorphicCard style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </GlassmorphicCard>
);

const MenuButton = ({ 
  icon, 
  label, 
  onPress 
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  label: string; 
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color={colors.text.primary} />
    <Text style={styles.menuButtonText}>{label}</Text>
    <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {dummyUser.username.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <Text style={styles.username}>{dummyUser.username}</Text>
              <Text style={styles.email}>{dummyUser.email}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <StatCard label="Accuracy" value={`${dummyUser.predictionAccuracy}%`} />
            <StatCard label="Predictions" value={dummyUser.totalPredictions} />
            <StatCard label="Streak" value={dummyUser.winningStreak} />
          </View>

          <GlassmorphicCard style={styles.menuCard}>
            <MenuButton
              icon="person-outline"
              label="Edit Profile"
              onPress={() => {}}
            />
            <MenuButton
              icon="settings-outline"
              label="Settings"
              onPress={() => {}}
            />
            <MenuButton
              icon="notifications-outline"
              label="Notifications"
              onPress={() => {}}
            />
            <MenuButton
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => {}}
            />
            <MenuButton
              icon="log-out-outline"
              label="Logout"
              onPress={handleLogout}
            />
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    padding: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  menuCard: {
    margin: 20,
    marginTop: 0,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 15,
  },
});
