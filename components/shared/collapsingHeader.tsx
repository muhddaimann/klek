import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useTheme, Text } from 'react-native-paper';
import { useDesign } from '../../contexts/designContext';
import Logo from './logo';

interface CollapsingHeaderProps {
  scrollY: SharedValue<number>;
  initialHeight: number;
  collapsedHeight: number;
}

const CollapsingHeader: React.FC<CollapsingHeaderProps> = ({
  scrollY,
  initialHeight,
  collapsedHeight,
}) => {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, initialHeight - collapsedHeight],
      [initialHeight, collapsedHeight],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, initialHeight - collapsedHeight],
      [1, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, initialHeight - collapsedHeight],
      [0, -(initialHeight - collapsedHeight)],
      Extrapolate.CLAMP
    );

    return {
      height,
      transform: [{ translateY }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, initialHeight - collapsedHeight],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, initialHeight - collapsedHeight],
      [1, 0.8], // Example: shrink title slightly
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, initialHeight - collapsedHeight],
      [0, (collapsedHeight - tokens.typography.sizes['2xl']) / 2], // Center title when collapsed
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.primaryContainer,
          overflow: 'hidden',
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing.sm,
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        },
        animatedStyle,
      ]}
    >
      <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md }, animatedContentStyle]}>
        <Logo size={tokens.typography.sizes['3xl'] * 1.5} />
        <View>
          <Text
            style={{
              color: colors.onPrimaryContainer,
              fontSize: tokens.typography.sizes['2xl'],
              fontWeight: '700',
            }}
          >
            Welcome, User
          </Text>
          <Text style={{ color: colors.onPrimaryContainer }}>
            Your financial overview
          </Text>
        </View>
      </Animated.View>

      {/* Collapsed Title/Logo (optional, for when header is fully collapsed) */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: tokens.spacing.sm,
            left: tokens.spacing.lg,
            right: tokens.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: 0, // Initially hidden
          },
          useAnimatedStyle(() => {
            const opacity = interpolate(
              scrollY.value,
              [initialHeight - collapsedHeight - 10, initialHeight - collapsedHeight],
              [0, 1],
              Extrapolate.CLAMP
            );
            return { opacity };
          }),
        ]}
      >
        <Logo size={tokens.typography.sizes.xl} />
        <Text
          style={{
            color: colors.onPrimaryContainer,
            fontSize: tokens.typography.sizes.lg,
            fontWeight: '700',
          }}
        >
          Home
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

export default CollapsingHeader;
