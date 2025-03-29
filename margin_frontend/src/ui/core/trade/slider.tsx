import { useEffect, useRef, useState } from "react";
import "./slider.css";

interface SliderProps {
    className?: string;
}


export function Slider({ className = "" }: SliderProps) {
    const [_value, setValue] = useState<number>(0);
    const [multiplayer, setMultiplayer] = useState<string>('0');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const array = [0, 10, 21, 31, 41, 51, 62, 72, 82, 100]

    function getRulerValue(rangeValue: number) {
        let i = 0;
        while (i < array.length - 1 && rangeValue > array[i + 1]) {
            i++;
        }

        if (rangeValue === 100) {
            return 10;
        }

        const rulerValue = (i + 1) + (rangeValue - array[i]) / (array[i + 1] - array[i]);
        return rulerValue;

    }

    function sliderChanged(event: React.FormEvent<HTMLInputElement>) {
        const value = Number(event.target.value);
        setValue(value);

        const mult = getRulerValue(value).toFixed(1);
        setMultiplayer(mult);
        drawRuler(Math.floor(mult * 10));
    }

    function drawRuler(current: number) {
        if (canvasRef.current == null) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.font = "10px serif";
        ctx.fillStyle = '#556571';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const x = 18//20;

        const gap = (canvas.width - x - x) / 90
        for (let i = 0; i <= 90; ++i) {
            ctx.fillStyle = current - 10 === i ? '#fff' : '#556571';
            if (i % 10 == 0) {
                ctx.fillText(String((i / 10) + 1), x + i * gap - 2, 22);
                ctx.fillRect(x + i * gap, 0, 2, 10)
            } else {
                ctx.fillRect(x + i * gap, 0, 2, 4)
            }
        }
    }


    useEffect(() => {
        drawRuler(0);

    }, []);


    className += " w-full h-[12px] relative bg-[#01060D] rounded-full";


    return (
        <div className="w-full relative flex flex-col items-center">

            <div className={className}>
                <div className={`absolute rounded-full  bg-[#00D1FF] 
                left-[0px] right-[0px]
                 top-0 bottom-0 inset-shadow-[#171E2852]/32 pointer-events-none`}
                    style={{ right: `calc(${100 - Number(multiplayer) * 10}%  + 25px)` }}>
                </div>

                <div className=" relative h-3">
                    <div className="absolute rounded-full  w-[38px] bg-[#00D1FF]
                -top-[50%] bottom-0  inset-shadow-[#171E2852]/32 px-[4px] py-[6px] h-[24px]
                text-[10px] text-[#06336E]  flex items-center justify-center
                pointer-events-none shadow-lg"
                        style={{ left: `${_value - (9.0 * 1.0 / (100 - _value))}%` }}>
                        {_value}|{multiplayer}
                    </div>
                </div>



                <input onInput={v => sliderChanged(v)} type="range" min="0" max="100"
                    // value={_value}
                    className="absolute top-0 left-0 opacity-0 right-0" />
            </div>

            <canvas ref={canvasRef} className="h-[50px] mt-[12px] left-[10px] right-[10px]  block w-full">
            </canvas>
        </div>

    );
}


