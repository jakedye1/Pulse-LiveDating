import { Stack } from 'expo-router';

export default function VerificationFlowLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="selfie" />
      <Stack.Screen name="liveness" />
      <Stack.Screen name="submit" />
      <Stack.Screen name="pending" />
    </Stack>
  );
}
