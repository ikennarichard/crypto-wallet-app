import ProfileHeader from "@/components/ProfileHeader";
import { getCoins } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Coins, Inbox, RefreshCcw, Send } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CryptoToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  holding?: number;
}

export default function CryptoWalletScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: getCoins,
    refetchInterval: 30000,
  });

  // Add mock holdings
  const tokens = data?.map((token: CryptoToken, index: number) => ({
    ...token,
    holding:
      index === 0 ? 0.00687 : index === 1 ? 2.24829 : index === 2 ? 0 : 0,
  }));
  const [totalBalance] = useState(21.23);
  const [percentageChange] = useState(0.34);

  const formatPrice = (price: number): string => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#1A5D4D", "#0A2F25", "#000000"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.7 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <Text style={styles.balance}>${totalBalance.toFixed(2)}</Text>
          <View style={styles.changeContainer}>
            <Text style={styles.changeAmount}>+$0.36</Text>
            <Text style={styles.changePercent}>
              {formatChange(percentageChange)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Inbox color='rgba(255, 255, 255, 0.5)' />
            </View>
            <Text style={styles.actionLabel}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Send color='rgba(255, 255, 255, 0.5)' />
            </View>
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <RefreshCcw color='rgba(255, 255, 255, 0.5)' />
            </View>
            <Text style={styles.actionLabel}>Swap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Coins color='rgba(255, 255, 255, 0.5)' />
            </View>
            <Text style={styles.actionLabel}>Buy</Text>
          </TouchableOpacity>
        </View>

        {/* Token List */}
        <View style={styles.tokenList}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#00D66F"
              style={styles.loader}
            />
          ) : (
            tokens?.map((token) => (
              <TouchableOpacity key={token.id} style={styles.tokenItem}>
                <View style={styles.tokenLeft}>
                  <Image
                    source={{ uri: token.image }}
                    style={styles.tokenIcon}
                  />
                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenName}>{token.name}</Text>
                    <Text style={styles.tokenAmount}>
                      {token.holding
                        ? `${token.holding} ${token.symbol.toUpperCase()}`
                        : `0 ${token.symbol.toUpperCase()}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.tokenRight}>
                  <Text style={styles.tokenPrice}>
                    {formatPrice(token.current_price)}
                  </Text>
                  <Text
                    style={[
                      styles.tokenChange,
                      token.price_change_percentage_24h >= 0
                        ? styles.tokenChangePositive
                        : styles.tokenChangeNegative,
                    ]}
                  >
                    {formatChange(token.price_change_percentage_24h)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A4D3C",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
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
    fontSize: 12,
    opacity: 0.7,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  accountText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownIcon: {
    color: "#fff",
    fontSize: 10,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },
  balanceSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  balance: {
    fontSize: 48,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -1,
  },
  changeContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  changeAmount: {
    color: "#00D66F",
    fontSize: 14,
    fontWeight: "600",
  },
  changePercent: {
    color: "#00D66F",
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    alignItems: "center",
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconText: {
    fontSize: 24,
  },
  actionLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 13,
  },
  tokenList: {
    paddingHorizontal: 20,
    gap: 4,
  },
  loader: {
    marginTop: 40,
  },
  tokenItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  tokenLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  tokenInfo: {
    gap: 4,
  },
  tokenName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  tokenAmount: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
  },
  tokenRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  tokenPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  tokenChange: {
    fontSize: 13,
    fontWeight: "500",
  },
  tokenChangePositive: {
    color: "#00D66F",
  },
  tokenChangeNegative: {
    color: "#FF4757",
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    fontSize: 22,
    opacity: 1,
  },
  tabItemCenter: {
    marginTop: -20,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00D66F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  centerButtonIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
});
