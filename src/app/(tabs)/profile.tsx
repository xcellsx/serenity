import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import { PillButton } from '@/components/pill-button';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { TextField } from '@/components/text-field';
import { BodyText, Heading } from '@/components/typography';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getProfile, updateProfile, type Profile } from '@/lib/db';
import { useMotion } from '@/lib/motion-context';
import { useThemePreference } from '@/lib/theme-context';

export default function ProfileScreen() {
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();
  const { setReduceMotion, setHighContrast } = useMotion();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [comfortDraft, setComfortDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getProfile()
        .then(setProfile)
        .catch(() => {});
    }, []),
  );

  const patch = (next: Partial<Profile>) => {
    setProfile((p) => (p ? { ...p, ...next } : p));
    updateProfile(next).catch(() => {});
  };

  const chooseTheme = (mode: 'light' | 'dark') => {
    setPreference(mode);
    patch({ theme: mode });
  };

  const startEditing = () => {
    setNameDraft(profile?.name?.trim() || '');
    setComfortDraft(profile?.comfort_word?.trim() || '');
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setNameDraft('');
    setComfortDraft('');
  };

  const saveIdentity = async () => {
    const name = nameDraft.trim() || null;
    const comfort_word = comfortDraft.trim() || null;
    setSaving(true);
    try {
      await updateProfile({ name, comfort_word });
      setProfile((p) => (p ? { ...p, name, comfort_word } : p));
      setEditing(false);
    } catch {
      // Keep edit mode open so they can retry.
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenBackground motion="serene">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View>
            <ScreenHeader />

            <View style={styles.identity}>
              <View style={[styles.avatar, { borderColor: theme.border }]}>
                <Feather name="user" size={28} color={theme.text} />
              </View>

              <View style={styles.identityText}>
                {editing ? (
                  <View style={styles.editFields}>
                    <TextField
                      value={nameDraft}
                      onChangeText={setNameDraft}
                      placeholder="Your name"
                      returnKeyType="next"
                    />
                    <TextField
                      value={comfortDraft}
                      onChangeText={setComfortDraft}
                      placeholder="Comfort word"
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={saveIdentity}
                    />
                    <View style={styles.editActions}>
                      <PillButton
                        label="Save"
                        onPress={() => {
                          if (!saving) void saveIdentity();
                        }}
                        style={styles.saveButton}
                      />
                      <Pressable onPress={cancelEditing} hitSlop={8}>
                        <BodyText size="caption" style={{ color: theme.textSecondary }}>
                          Cancel
                        </BodyText>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <>
                    <Heading size="heading">{profile?.name || 'Friend'}</Heading>
                    <BodyText size="caption" style={[styles.comfort, { color: theme.accent }]}>
                      {(profile?.comfort_word || 'comfort word').toUpperCase()}
                    </BodyText>
                  </>
                )}
              </View>

              {!editing ? (
                <Pressable
                  onPress={startEditing}
                  accessibilityLabel="Edit name and comfort word"
                  hitSlop={8}
                  style={({ pressed }) => [styles.editButton, { opacity: pressed ? 0.7 : 1 }]}>
                  <Feather name="edit-2" size={20} color={theme.text} />
                </Pressable>
              ) : null}
            </View>

            <SectionLabel>APP THEME</SectionLabel>
            <View style={styles.themeRow}>
              <PillButton
                label="Light Mode"
                selected={preference === 'light'}
                onPress={() => chooseTheme('light')}
                style={styles.themeButton}
              />
              <PillButton
                label="Dark Mode"
                selected={preference === 'dark'}
                onPress={() => chooseTheme('dark')}
                style={styles.themeButton}
              />
            </View>

            <SectionLabel>IN APP SETTINGS</SectionLabel>
            <ToggleRow
              label="Reduce Motion"
              value={!!profile?.reduce_motion}
              onValueChange={(v) => {
                setReduceMotion(v);
                patch({ reduce_motion: v });
              }}
            />
            <ToggleRow
              label="High Contrast Text"
              value={!!profile?.high_contrast}
              onValueChange={(v) => {
                setHighContrast(v);
                patch({ high_contrast: v });
              }}
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

function SectionLabel({ children }: { children: string }) {
  const theme = useTheme();
  return (
    <BodyText size="caption" style={[styles.sectionLabel, { color: theme.text }]}>
      {children}
    </BodyText>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.toggleRow}>
      <BodyText size="body" style={{ color: theme.text }}>
        {label}
      </BodyText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: theme.accent, false: theme.border }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six + Spacing.five + BottomTabInset,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  identityText: { flex: 1, minWidth: 0 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  comfort: { letterSpacing: 1.5, marginTop: 2 },
  editButton: {
    padding: Spacing.one,
    marginTop: Spacing.one,
  },
  editFields: { gap: Spacing.two },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  saveButton: { minWidth: 100 },
  sectionLabel: {
    letterSpacing: 1.5,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  themeRow: { flexDirection: 'row', gap: Spacing.three },
  themeButton: { flex: 1 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
});
