import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TrackNode } from '../../../types/mobile.types';

interface MobileTrailProps {
  nodes: TrackNode[];
  onSelectNode: (node: TrackNode) => void;
}

export const MobileTrail: React.FC<MobileTrailProps> = ({ nodes, onSelectNode }) => {
  // Offsets for the snake curved path
  const getHorizontalOffset = (index: number) => {
    const cycle = index % 4;
    if (cycle === 1) return 40;
    if (cycle === 3) return -40;
    return 0;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.trailWrapper}>
        {nodes.map((node, idx) => {
          const offsetX = getHorizontalOffset(idx);
          const isCompleted = node.completed;
          const isLocked = node.locked;
          const isActive = !isCompleted && !isLocked;

          return (
            <View key={node.id} style={[styles.nodeWrapper, { transform: [{ translateX: offsetX }] }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={isLocked}
                onPress={() => onSelectNode(node)}
                style={[
                  styles.nodeButton,
                  isCompleted && styles.completedNode,
                  isActive && styles.activeNode,
                  isLocked && styles.lockedNode,
                ]}
              >
                <Text style={styles.nodeIcon}>
                  {isCompleted ? '✓' : isLocked ? '🔒' : '★'}
                </Text>
              </TouchableOpacity>

              <View style={styles.nodeLabelBubble}>
                <Text style={styles.nodeLabelText} numberOfLines={1}>
                  {node.title}
                </Text>
                <Text style={styles.nodeXpText}>+{node.xpReward} XP</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  trailWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  nodeWrapper: {
    alignItems: 'center',
    marginVertical: 18,
  },
  nodeButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedNode: {
    backgroundColor: '#10B981',
    borderBottomWidth: 5,
    borderBottomColor: '#059669',
  },
  activeNode: {
    backgroundColor: '#3B82F6',
    borderBottomWidth: 6,
    borderBottomColor: '#1D4ED8',
    elevation: 6,
  },
  lockedNode: {
    backgroundColor: '#334155',
    borderBottomWidth: 5,
    borderBottomColor: '#1E293B',
    opacity: 0.7,
  },
  nodeIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  nodeLabelBubble: {
    marginTop: 8,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    maxWidth: 160,
  },
  nodeLabelText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },
  nodeXpText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 1,
  },
});
