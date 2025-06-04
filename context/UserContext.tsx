import React, { createContext, useContext, useState, ReactNode } from "react";

type UserType = "cidadao" | "agente" | null;

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve estar dentro de UserProvider");
  return context;
};

export type { UserContextType };
export { UserContext };
