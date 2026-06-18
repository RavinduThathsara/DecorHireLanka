import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("customer");
    setCustomer(saved ? JSON.parse(saved) : null);

    const savedNotifs = localStorage.getItem("notifications");
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const loginCustomer = useCallback(({ token, customer }) => {
    localStorage.setItem("customerToken", token);
    localStorage.setItem("customer", JSON.stringify(customer));
    setCustomer(customer);
  }, []);

  const logoutCustomer = useCallback(() => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    localStorage.removeItem("notifications");
    setCustomer(null);
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: Date.now(),
      time: "Just now",
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const value = useMemo(
    () => ({
      customer,
      isCustomerLoggedIn: !!customer,
      loginCustomer,
      logoutCustomer,
      notifications,
      addNotification,
      markAllAsRead
    }),
    [customer, notifications, addNotification, markAllAsRead]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
