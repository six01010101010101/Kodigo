/**
 * Centralized Design Tokens for Kodigo
 * Ensures consistent 3D button depth, tactile feedback, and theme harmony.
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: {
      emerald: '#10B981',
      emeraldDark: '#059669',
      emeraldLight: '#34D399',
    },
    cyber: {
      cyan: '#06B6D4',
      cyanDark: '#0891B2',
      blue: '#3B82F6',
      indigo: '#6366F1'
    },
    accent: {
      amber: '#F59E0B',
      amberDark: '#D97706',
      rose: '#F43F5E',
      roseDark: '#E11D48',
      purple: '#8B5CF6'
    }
  },
  shadows3D: {
    green: '0 4px 0 #059669',
    blue: '0 4px 0 #0891B2',
    amber: '0 4px 0 #D97706',
    rose: '0 4px 0 #E11D48',
    purple: '0 4px 0 #7C3AED',
    neutral: '0 4px 0 #CBD5E1',
    neutralDark: '0 4px 0 #1E293B'
  }
} as const;
