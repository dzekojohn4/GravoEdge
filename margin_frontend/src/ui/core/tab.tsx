import { type ReactNode, useState } from "react";
import {  Search } from "lucide-react";
import {Input} from "./input";
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

export function Tabs({ tabs, defaultActiveIndex = 0, className = "" }: TabsProps) {
	const [activeIndex] = useState(defaultActiveIndex);

	return (
		<div className={`w-fullgo   ${className}`}>
			<div className="flex items-center justify-between border-b border-inactiveTab bg-pageBg">
				<div className="flex gap-6">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						className={`px-4 py-2 whitespace-nowrap text-sm  font-medium focus:outline-none transition-colors  ${
							activeIndex === tabs.indexOf(tab)
								? " text-[#00D1FF] border-b-2 border-t-2 border-[#00D1FF] "
								: "text-tabText hover:text-baseWhite "
						}`}
					>
						{tab.label}
					</button>
					
				))}
				</div>

				<div className="col-span-2 hidden lg:block">
					<div className="flex  items-center justify-between">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#848484]" />
							<Input
								placeholder="Search..."
								className="pl-10 h-[48px] w-full max-w-[305px]  bg-transparent border-grayborder border-solid border-1 rounded-[8px] text-[#848484] bricolage"
							/>
						</div>
					</div>
				</div>


				
			</div>
			
			<div className="pt-4">{tabs[activeIndex]?.content}</div>
		
		</div>
	);
}
