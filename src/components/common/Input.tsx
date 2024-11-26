import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
  icon?: string;
}

export function Input({ icon, style, ...props }: InputProps) {
  return (
    <View style={styles.inputContainer}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={20}
          color={colors.text.light}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.text.secondary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.text.light,
    fontSize: 16,
    paddingVertical: 12,
  },
});
