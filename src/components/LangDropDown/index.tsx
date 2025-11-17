/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, memo } from "react"
import langList from '@/assets/langList.json'
import Image from "next/image"
import { useLang } from "@/store/useLang"
import { useLayoutEffect } from "react"

const LangDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { setLang } = useLang()
    const [selectedLang, setSelectedLang] = useState(langList[0])
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Click outside closes menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setFocusedIndex(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useLayoutEffect(() => {
        const lang = localStorage.getItem('lang') ?? 'en'
        const index = langList.findIndex((ele) => ele.code === lang.toLocaleUpperCase());
        setSelectedLang(langList[index])
        setLang(lang)
    }, [])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault()
                    setFocusedIndex(prev => (prev === null || prev === langList.length - 1 ? 0 : prev + 1))
                    break
                case "ArrowUp":
                    e.preventDefault()
                    setFocusedIndex(prev => (prev === null || prev === 0 ? langList.length - 1 : prev - 1))
                    break
                case "Enter":
                    if (focusedIndex !== null) {
                        setSelectedLang(langList[focusedIndex])
                        setIsOpen(false)
                        setFocusedIndex(null)
                    }
                    break
                case "Escape":
                    setIsOpen(false)
                    setFocusedIndex(null)
                    break
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, focusedIndex])

    return (
        <div className="relative inline-block text-left" ref={wrapperRef}>
            {/* Dropdown Trigger Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="inline-flex items-center justify-between w-25 px-4 py-2 text-sm font-medium"
            >
                <span className="flex items-center gap-2">
                    <Image
                        src={`https://flagcdn.com/w40/${selectedLang.symbol.toLowerCase()}.png`}
                        width={20}
                        height={16}
                        alt={`${selectedLang.code} flag`}
                        className="w-5 h-4 object-cover "
                    />
                    <span>{selectedLang.code.toLocaleUpperCase()}</span>
                </span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <ul className="absolute z-10 w-30 mt-2 right-0 bg-white border border-gray-200 rounded shadow">
                    {langList.map((lang, index) => (
                        <li key={lang.id}>
                            <button
                                onClick={() => {
                                    setSelectedLang(lang)
                                    setIsOpen(false)
                                    setFocusedIndex(null)
                                    localStorage.setItem('lang', lang.code.toLocaleLowerCase())

                                    setLang(lang.code.toLocaleLowerCase())
                                }}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${index === focusedIndex
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <Image
                                    src={`https://flagcdn.com/w40/${lang.symbol.toLowerCase()}.png`}
                                    alt={`${lang.name} flag`}
                                    className="w-5 h-4 object-cover"
                                    width={20}
                                    height={16}
                                />
                                <span>{lang.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default memo(LangDropdown)