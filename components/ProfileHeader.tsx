import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ProfileHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/men/32.jpg",
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>@ikennarichard</Text>
          <View style={styles.accountRow}>
            <Text style={styles.accountText}>richyr306@gmail.com</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  username: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.7,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  accountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.9
  },
});
