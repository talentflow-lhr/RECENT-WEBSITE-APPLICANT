import { createContext, useContext, useState, ReactNode } from "react";

interface Account {
  account_id: number;
  applicant_id: number;
  acc_username: string;
  acc_email: string;
  is_active: boolean;
  acc_password: string;
}

interface AuthContextType {
  account: Account | null;
  setAccount: (account: Account | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  account: null,
  setAccount: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(() => {
    const stored = localStorage.getItem("account");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <AuthContext.Provider value={{ account, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
