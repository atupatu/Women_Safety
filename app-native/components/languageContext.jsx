import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from '../translations';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyA-dVx1ZbV4s2U7Ih0M4j1AoRv1QA25GrA";
const genAI = new GoogleGenerativeAI(API_KEY);
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLang = await AsyncStorage.getItem("language");
    if (savedLang) {
      setLanguage(savedLang);
      await translateAllTexts(savedLang);
    }
  };

  const translateAllTexts = async (targetLang) => {
    if (targetLang === 'en') {
      setTranslations(translations.en);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const textsToTranslate = translations.en;
      
      const translatedTexts = {};
      for (const [key, text] of Object.entries(textsToTranslate)) {
        const prompt = `Translate to ${targetLang}: "${text}"`;
        const response = await model.generateContent(prompt);
        translatedTexts[key] = response.response.text().trim();
      }
      
      setTranslations(translatedTexts);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslations(translations.en);
    }
  };

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    await AsyncStorage.setItem("language", newLang);
    await translateAllTexts(newLang);
  };

  const t = (key) => translations[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
