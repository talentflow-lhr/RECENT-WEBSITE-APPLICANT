import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

interface Applicant {
  app_first_name?: string;
  app_middle_name?: string;
  app_last_name?: string;
  app_email?: string;
  app_present_tele_mobile?: string;
  app_present_address_country?: string;
  app_present_address_province?: string;
  app_present_address_city?: string;
  app_present_contact_person?: string;
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
  app_emergency_relationship?: string;
  app_emergency_contact_number?: string;
  app_province_address_country?: string;
  app_province_address_province?: string;
  app_province_address_city?: string;
  app_province_contact_person?: string;
  app_province_tele_mobile?: string;
}

interface Account {
  account_id: number;
  applicant_id: number;
  acc_username: string;
  acc_email: string;
  is_active: boolean;
  acc_password: string;
  t_applicant?: Applicant;
}

interface AuthContextType {
  account: Account | null;
  setAccount: (account: Account | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  account: null,
  setAccount: () => {},
});

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccountState] = useState<Account | null>(() => {
    // Check expiry before restoring session
    const expiry = localStorage.getItem("session_expiry");
    if (expiry && Date.now() > parseInt(expiry)) {
      localStorage.removeItem("account");
      localStorage.removeItem("session_expiry");
      return null;
    }
    const stored = localStorage.getItem("account");
    return stored ? JSON.parse(stored) : null;
  });

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setAccount = (acc: Account | null) => {
    setAccountState(acc);
    if (acc) {
      localStorage.setItem("account", JSON.stringify(acc));
      // Set expiry immediately on login
      const expiry = Date.now() + INACTIVITY_TIMEOUT;
      localStorage.setItem("session_expiry", expiry.toString());
    } else {
      localStorage.removeItem("account");
      localStorage.removeItem("session_expiry");
    }
  };

  useEffect(() => {
    if (!account) return;

    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

      const expiry = Date.now() + INACTIVITY_TIMEOUT;
      localStorage.setItem("session_expiry", expiry.toString());

      inactivityTimer.current = setTimeout(() => {
        setAccountState(null);
        localStorage.removeItem("account");
        localStorage.removeItem("session_expiry");
        alert("You have been logged out due to inactivity.");
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart", "click"];

    resetTimer(); // start timer when logged in
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [account]);

  return (
    <AuthContext.Provider value={{ account, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
