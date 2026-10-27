import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const pixels = [
  { top: "18%", left: "8%", color: "#A259FF" },
  { top: "31%", right: "12%", color: "#00CFFF" },
  { top: "58%", left: "18%", color: "#00CFFF" },
  { top: "70%", right: "22%", color: "#A259FF" },
  { top: "45%", right: "6%", color: "#A259FF" },
  { top: "24%", left: "28%", color: "#00CFFF" },
] as const;

export default function HomeScreen({ navigation }: any) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.radialGlow} />
      <View style={[styles.shape, styles.circleOne]} />
      <View style={[styles.shape, styles.circleTwo]} />
      <View style={[styles.shape, styles.triangleOne]} />
      <View style={[styles.shape, styles.triangleTwo]} />
      {pixels.map((pixel, index) => (
        <View key={index} style={[styles.pixel, { top: pixel.top, left: "left" in pixel ? pixel.left : undefined, right: "right" in pixel ? pixel.right : undefined, backgroundColor: pixel.color }]} />
      ))}

      <View style={styles.hero}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleMain}>Operación</Text>
          <Text style={styles.titleSub}>anti procrastinación</Text>
        </View>
        <View style={styles.neonUnderline} />
        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.navigate("Levels")}
            onHoverIn={() => setHoveredButton("levels")}
            onHoverOut={() => setHoveredButton(null)}
            style={({ pressed }) => [styles.buttonShell, (pressed || hoveredButton === "levels") && styles.buttonHover]}
          >
            <LinearGradient colors={["#174CEB", "#17A7FF"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Niveles</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Créditos", "Operación Anti Procrastinación\nDiseñado para mantener el enfoque ⚡")}
            onHoverIn={() => setHoveredButton("credits")}
            onHoverOut={() => setHoveredButton(null)}
            style={({ pressed }) => [styles.buttonShell, styles.creditsShell, (pressed || hoveredButton === "credits") && styles.buttonHover]}
          >
            <LinearGradient colors={["#00E7E0", "#00DF73"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Créditos</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <Text style={styles.signature}>Made with focus ⚡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "#0B1016" },
  radialGlow: { position: "absolute", width: "120%", height: "90%", bottom: -120, backgroundImage: "radial-gradient(ellipse at center bottom, rgba(162,89,255,0.75) 0%, rgba(83,45,130,0.35) 28%, rgba(11,16,22,0) 68%)" },
  hero: { width: "100%", alignItems: "center", transform: [{ translateY: -18 }] },
  titleBlock: { alignItems: "center" },
  titleMain: { fontFamily: "Fredoka", fontSize: 54, lineHeight: 56, fontWeight: "800", color: "#F03BFF", textAlign: "center", textShadowColor: "#C22EFF", textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10 },
  titleSub: { fontFamily: "Fredoka", fontSize: 30, lineHeight: 34, fontWeight: "800", color: "#FF78FF", textAlign: "center", textShadowColor: "#A259FF", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  neonUnderline: { width: "58%", height: 4, marginTop: 12, marginBottom: 30, borderRadius: 4, backgroundColor: "#C981FF", shadowColor: "#F54DFF", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 12, elevation: 8 },
  actions: { width: "68%", maxWidth: 430, alignItems: "stretch", gap: 24 },
  buttonShell: { width: "100%", height: 82, borderRadius: 10, borderWidth: 3, borderColor: "rgba(96,184,255,0.85)", shadowColor: "#00CFFF", shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.95, shadowRadius: 10, elevation: 12, padding: 5, backgroundColor: "#102C68" },
  creditsShell: { borderColor: "rgba(0,238,255,0.9)", shadowColor: "#00FFAA", backgroundColor: "#083D5A" },
  buttonHover: { transform: [{ translateY: -4 }], shadowOpacity: 1, shadowRadius: 16 },
  gradientButton: { flex: 1, borderRadius: 5, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#FFFFFF", fontFamily: "Fredoka", fontSize: 34, fontWeight: "800", textShadowColor: "rgba(4,18,55,0.8)", textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 2 },
  signature: { position: "absolute", right: 20, bottom: 18, color: "#A259FF", fontFamily: "Fredoka", fontSize: 11, fontWeight: "300", opacity: 0.85 },
  shape: { position: "absolute", backgroundColor: "rgba(30,38,51,0.42)" },
  circleOne: { width: 130, height: 130, borderRadius: 65, left: -35, top: "16%" },
  circleTwo: { width: 96, height: 96, borderRadius: 48, right: "12%", bottom: "12%", borderWidth: 18, borderColor: "rgba(162,89,255,0.16)", backgroundColor: "transparent" },
  triangleOne: { width: 150, height: 150, right: -65, top: "8%", opacity: 0.25, transform: [{ rotate: "28deg" }] },
  triangleTwo: { width: 120, height: 120, left: "9%", bottom: "8%", opacity: 0.18, transform: [{ rotate: "18deg" }] },
  pixel: { position: "absolute", width: 5, height: 5, borderRadius: 1, shadowColor: "#A259FF", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 7, elevation: 4 },
});
