import { addFavorite, getFavorites, removeFavorite } from "@/lib/favorites";
import { createContext, ReactNode, use, useEffect, useState } from "react";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (coinId: string) => boolean;
  toggleFavorite: (coinId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const items = await getFavorites();

        setFavorites(items);
      } catch (err) {
        console.error(err as Error);
      }
    };
    fetchFavorites();
  }, []);

  const isFavorite = (coinId: string) => {
    return favorites.some((fav) => fav === coinId);
  };

  const toggleFavorite = (coinId: string) => {
    if (favorites.includes(coinId)) {
      removeFavorite(coinId);
      setFavorites(favorites.filter((id) => id !== coinId));
    } else {
      addFavorite(coinId);
      setFavorites([...favorites, coinId]);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = use(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
