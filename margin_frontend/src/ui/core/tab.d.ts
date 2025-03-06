import type { ReactNode } from "react";
interface Tab {
	label: string;
	content: ReactNode;
	id: string;
}
interface TabsProps {
	tabs: Tab[];
	defaultActiveIndex?: number;
	className?: string;
}
export declare function Tabs({
	tabs,
	defaultActiveIndex,
	className,
}: TabsProps): import("react/jsx-runtime").JSX.Element;
