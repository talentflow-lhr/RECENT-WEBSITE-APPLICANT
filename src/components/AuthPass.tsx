import { createContext, useContext, useState, ReactNode } from "react";

interface Applicant {
  app_first_name?: string;
  app_middle_name?: string;
  app_last_name?: string;
  app_email?: string;
  app_present_tele_mobile?: string;
  app_present_address_country?: string;
  app_present_address_province?: string;
  app_present_address_city?: string;
  app_dob_day?: string;
  app_dob_month?: string;
  app_dob_year?: string;
  app_marital_status?: string;
  app_height?: string;
  app_weight?: string;
  app_passport_number?: string;
  app_passport_place?: string;
  app_passport_issue_date?: string;
  app_passport_expiry_date?: string;
  app_nationality?: string;
  app_preference?: string[];
  app_gender?: string;
}

interface Account {
  account_id: number;
  applicant_id: number;
  acc_username: string;
  acc_email: string;
  is_active: boolean;
  acc_password: string;
  t_applicant?: Applicant; // ✅ add this
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
  const [account, setAccountState] = useState<Account | null>(() => {
    const stored = localStorage.getItem("account");
    return stored ? JSON.parse(stored) : null;
  });

  const setAccount = (acc: Account | null) => {
    setAccountState(acc);
    if (acc) {
      localStorage.setItem("account", JSON.stringify(acc));
    } else {
      localStorage.removeItem("account");
    }
  };

  return (
    <AuthContext.Provider value={{ account, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
