import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Text, View } from "react-native";

import { guideScreenStyles as styles } from "../styles/GuideScreenStyles";

export default function GuideScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0B1016", "#17102C", "#0B1016"]}
        locations={[0, 0.5, 1]}
        style={styles.background}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Guía de juego</Text>
        <Text style={styles.subtitle}>
          ¡Practica a tu ritmo y encuentra el camino hasta la meta!
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tu misión</Text>
          <Text style={styles.body}>
            Llega hasta la puerta para completar el nivel. Recoge monedas para
            sumar 10 puntos por cada una y esquiva a los enemigos y sus rayos
            rojos. Puedes aterrizar encima de las camas flotantes, pero evita
            tocarlas por los lados. Tienes 2 minutos para llegar a la meta.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Controles</Text>
          <View style={styles.controlGroup}>
            <Text style={styles.controlTitle}>MÓVIL</Text>
            <Text style={styles.body}>
              Mantén ← o → para correr en esa dirección; suelta para detenerte.
              Toca ↑ para saltar cuando estés en el suelo o una plataforma.
            </Text>
          </View>
          <View style={styles.controlGroup}>
            <Text style={styles.controlTitle}>COMPUTADORA</Text>
            <Text style={styles.body}>
              Mantén ← o → para correr; suelta la tecla para detenerte. Pulsa
              ↑ o la barra espaciadora para saltar cuando estés en el suelo o
              una plataforma.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.sectionTitle}>Consejos para practicar</Text>
          <Text style={styles.body}>
            Prueba primero los movimientos y los saltos en una zona segura.
            Calcula el momento del salto para alcanzar las plataformas y las
            monedas, y espera a que pase el peligro antes de avanzar. Puedes
            pausar o repetir el nivel cuando quieras practicar otra vez.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate("Levels")}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressedButton,
            ]}
          >
            <LinearGradient
              colors={["#174CEB", "#17A7FF"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.actionGradient}
            >
              <Text style={styles.actionText}>Elegir nivel</Text>
            </LinearGradient>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Text style={styles.backButtonText}>Volver al inicio</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
