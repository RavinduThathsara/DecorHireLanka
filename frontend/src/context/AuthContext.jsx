// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("customer");
    setCustomer(saved ? JSON.parse(saved) : null);
  }, []);

  const loginCustomer = ({ token, customer }) => {
    localStorage.setItem("customerToken", token);
    localStorage.setItem("customer", JSON.stringify(customer));
    setCustomer(customer);
  };

  const logoutCustomer = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    setCustomer(null);
  };

  const value = useMemo(
    () => ({
      customer,
      isCustomerLoggedIn: !!customer,
      loginCustomer,
      logoutCustomer,
    }),
    [customer]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
