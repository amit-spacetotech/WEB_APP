import create from "zustand";
import { persist } from "zustand/middleware";

export const useGlobalStore = create(
  persist(
    (set) => ({
      userDetails: {},
      landingPage: true,
      profileImg: false,

      setUserDetails: async (value) => {
        set((state) => ({ userDetails: value }));
      },
      setLandingPage: async (value) => {
        set((state) => ({ landingPage: value }));
      },
      setProfileImg: async (value) => {
        set((state) => ({ profileImg: value }));
      },
    }),
    {
      name: "storage",
      getStorage: () => localStorage,
    }
  )
);
