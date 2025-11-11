import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const getFavorites = async (): Promise<string[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = async (coinId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(coinId)) {
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify([...favorites, coinId])
      );
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

export const removeFavorite = async (coinId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites.filter((id) => id !== coinId))
    );
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

export const toggleFavorite = async (coinId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const isFavorite = favorites.includes(coinId);
    
    if (isFavorite) {
      await removeFavorite(coinId);
      return false;
    } else {
      await addFavorite(coinId);
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};