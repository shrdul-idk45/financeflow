import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../../lib/supabase";

/* =======================
   Types
======================= */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  monthlyBudget: number;
  selectedCategories: string[];
  onboardingComplete: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "expense" | "income";
}

/**
 * TEMPORARY UI FALLBACK
 * Will be replaced by Supabase categories table
 */
export const CATEGORIES = [
  { id: "food", name: "Food & Dining", icon: "🍔", color: "#FF6B6B" },
  { id: "transport", name: "Transport", icon: "🚗", color: "#4ECDC4" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "#95E1D3" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "#FFE66D" },
  { id: "bills", name: "Bills & Utilities", icon: "💡", color: "#A8E6CF" },
  { id: "health", name: "Health", icon: "⚕️", color: "#FF8B94" },
  { id: "education", name: "Education", icon: "📚", color: "#B4A7D6" },
  { id: "travel", name: "Travel", icon: "✈️", color: "#FFD3B6" },
  { id: "savings", name: "Savings", icon: "💰", color: "#A8DADC" },
  { id: "other", name: "Other", icon: "📦", color: "#C7CEEA" },
];

interface AppContextType {
  user: User | null;
  expenses: Expense[];
  theme: "light" | "dark";
  currentScreen: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  toggleTheme: () => void;
  setCurrentScreen: (screen: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

/* =======================
   Provider
======================= */

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentScreen, setCurrentScreen] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  /* =======================
     Theme persistence
  ======================= */
  useEffect(() => {
    const savedTheme = localStorage.getItem("financeApp_theme");
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("financeApp_theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /* =======================
     Restore Supabase session
  ======================= */

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
  
        setUser({
          id: u.id,
          name: u.email?.split("@")[0] || "User",
          email: u.email || "",
          monthlyBudget: 0,
          selectedCategories: [],
          onboardingComplete: true,
        });
  
        await fetchExpenses(u.id);   // 👈 ADD THIS LINE
        setCurrentScreen("dashboard");
      }
    });
  }, []);
  

  /* =======================
     Auth state listener
  ======================= */

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setUser(null);
          setExpenses([]);
          setCurrentScreen("login");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* =======================
     Auth actions
  ======================= */
  const fetchExpenses = async (userId: string) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
  
    if (!error && data) {
      setExpenses(data);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }

    const u = data.user;

    setUser({
      id: u.id,
      name: u.email?.split("@")[0] || "User",
      email: u.email || "",
      monthlyBudget: 0,
      selectedCategories: [],
      onboardingComplete: true,
    });
    await fetchExpenses(u.id);   // 👈 ADD THIS LINE
    setCurrentScreen("dashboard");
    setIsLoading(false);

  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }

    const u = data.user!;

    setUser({
      id: u.id,
      name,
      email,
      monthlyBudget: 0,
      selectedCategories: [],
      onboardingComplete: false,
    });

    setCurrentScreen("onboarding-welcome");
    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setExpenses([]);
    setCurrentScreen("login");
  };

  /* =======================
     User & Expense helpers
     (TEMPORARY – DB NEXT)
  ======================= */

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const addExpense = async (expense: Omit<Expense, "id">) => {
    if (!user) return;
  
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        ...expense,
      })
      .select()
      .single();
  
    if (error) {
      console.error(error);
      return;
    }
  
    setExpenses(prev => [data, ...prev]);
  };


  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        expenses,
        theme,
        currentScreen,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        addExpense,
        updateExpense,
        deleteExpense,
        toggleTheme,
        setCurrentScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
