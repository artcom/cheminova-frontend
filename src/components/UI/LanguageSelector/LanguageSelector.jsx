import { changeLanguage, getCurrentLocale } from "@/i18n"
import { useLanguages } from "@/providers/LanguageProvider"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { styled } from "styled-components"

const SelectorContainer = styled.div`
  position: relative;
  display: inline-block;
`

const CurrentLanguage = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.8 : 1)};
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  &::after {
    content: "▼";
    font-size: 0.75rem;
    transition: transform 0.2s ease;
    transform: ${({ $isOpen }) =>
      $isOpen ? "rotate(180deg)" : "rotate(0deg)"};
  }
`

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(20px);
  min-width: 120px;
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-8px)"};
  transition: all 0.2s ease;
`

const LanguageOption = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:only-child {
    border-radius: 8px;
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    background: rgba(255, 255, 255, 0.15);
    font-weight: 600;

    &::after {
      content: '✓';
      float: right;
      color: #4ecdc4;
    }
  `}
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`

export default function LanguageSelector({ className }) {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState(() => getCurrentLocale())
  const { supportedLanguages, isLoading } = useLanguages()
  const languageCodes = useMemo(
    () => Object.keys(supportedLanguages),
    [supportedLanguages],
  )
  const hasMultipleLanguages = languageCodes.length > 1

  useEffect(() => {
    const controller = new AbortController()

    const handleLanguageChange = () => {
      if (controller.signal.aborted) return
      setCurrentLocale(getCurrentLocale())
    }

    handleLanguageChange()

    i18n.on("languageChanged", handleLanguageChange)
    return () => {
      controller.abort()
      i18n.off("languageChanged", handleLanguageChange)
    }
  }, [i18n])

  const handleLanguageChange = async (languageCode) => {
    await changeLanguage(languageCode)
    setIsOpen(false)
  }

  const toggleDropdown = () =>
    hasMultipleLanguages && setIsOpen((previous) => !previous)

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const currentLanguageName =
    supportedLanguages[currentLocale] ??
    supportedLanguages[languageCodes[0]] ??
    currentLocale.toUpperCase()

  if (isLoading) {
    return (
      <SelectorContainer className={className}>
        <CurrentLanguage $isOpen={false}>Loading...</CurrentLanguage>
      </SelectorContainer>
    )
  }

  return (
    <>
      <Overlay
        $isOpen={isOpen && hasMultipleLanguages}
        onClick={closeDropdown}
      />
      <SelectorContainer className={className}>
        <CurrentLanguage
          $isOpen={isOpen}
          onClick={toggleDropdown}
          disabled={!hasMultipleLanguages}
        >
          {currentLanguageName}
        </CurrentLanguage>

        <LanguageDropdown $isOpen={isOpen && hasMultipleLanguages}>
          {languageCodes.map((code) => (
            <LanguageOption
              key={code}
              $isActive={code === currentLocale}
              onClick={() => handleLanguageChange(code)}
            >
              {supportedLanguages[code]}
            </LanguageOption>
          ))}
        </LanguageDropdown>
      </SelectorContainer>
    </>
  )
}
