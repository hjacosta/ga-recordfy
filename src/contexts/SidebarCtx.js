import React from "react";

const SidebarContext = React.createContext();

function SidebarProvider({ children }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const sidebarWidth = "260px";

  return (
    <SidebarContext.Provider
      value={{
        isVisible,
        setIsVisible,
        sidebarWidth,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export { SidebarContext, SidebarProvider };
