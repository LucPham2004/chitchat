import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

// Tạo Context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Provider để bọc toàn bộ ứng dụng
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        () => localStorage.getItem('theme') === 'dark'
    );

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', !isDarkMode);
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            <div className={isDarkMode ? 'dark' : ''}>{children}</div>
        </ThemeContext.Provider>
    );
};

// Custom hook để sử dụng ThemeContext
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme phải được sử dụng bên trong ThemeProvider');
    }
    return context;
};
