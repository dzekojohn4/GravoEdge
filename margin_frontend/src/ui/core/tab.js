import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export function Tabs({ tabs, defaultActiveIndex = 0, className = "" }) {
    const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
    return (_jsxs("div", { className: `w-full ${className}`, children: [_jsx("div", { className: "flex border-b border-inactiveTab bg-pageBg", children: tabs.map((tab) => (_jsx("button", { type: "button", className: `p-4 text-sm  font-medium focus:outline-none transition-colors min-w-[100px] ${activeIndex === tabs.indexOf(tab)
                        ? " rounded-t-lg text-baseWhite bg-navbg border-b border-activeTab "
                        : "text-tabText hover:text-baseWhite "}`, onClick: () => {
                        setActiveIndex(tabs.indexOf(tab));
                    }, children: tab.label }, tab.id))) }), _jsx("div", { className: "p-4", children: tabs[activeIndex]?.content })] }));
}
