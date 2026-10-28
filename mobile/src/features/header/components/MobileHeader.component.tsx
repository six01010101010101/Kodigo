import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserStats } from '../../../types/mobile.types';

interface MobileHeaderProps {
  stats: UserStats;
  trackName: string;
  onOpenChat: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ stats, trackName, onOpenChat }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.statBadge}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statText}>{stats.streak}</Text>
        </View>

        <View style={styles.statBadge}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={styles.statText}>{stats.gems}</Text>
        </View>

        <View style={styles.statBadge}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statText}>{stats.isPro ? '∞' : stats.hearts}</Text>
        </View>

        <TouchableOpacity style={styles.chatButton} onPress={onOpenChat} activeOpacity={0.8}>
          <Text style={styles.chatIcon}>🐍</Text>
          <Text style={styles.chatButtonText}>Pytho</Text>
          <View style={styles.onlineDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.trackBanner}>
        <Text style={styles.trackLabel}>TRILHA ATIVA</Text>
        <Text style={styles.trackTitle}>{trackName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#1E293B',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  statText: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: 13,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#059669',
  },
  chatIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A7F3D0',
    marginLeft: 6,
  },
  trackBanner: {
    marginTop: 12,
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  trackLabel: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
});
