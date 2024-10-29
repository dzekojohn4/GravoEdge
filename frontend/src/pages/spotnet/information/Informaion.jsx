import './information.css';
import { ReactComponent as Star } from "../../../assets/particles/star.svg";
import React, { useEffect, useState } from "react";

const Information = () => {
    const [data, setData] = useState({ total_opened_amount: 0, unique_users: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get_stats`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setData({
                    total_opened_amount: result.total_opened_amount,
                    unique_users: result.unique_users,
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    
    const starData = [
        { top: 9, left: -6.2, size: 20 },
        { top: 9, left: 39, size: 15 },
        { top: -8, left: 85, size: 18 },
        { top: 74, left: 43, size: 22 },
    ];

    return (
        <div className="information">
            <div className="card-info__container">
                <div className="card-info flex">
                    <h1>TVL</h1>
                    <h3>{loading ? "Loading..." : error ? `Error: ${error}` : data.total_opened_amount}</h3>
                </div>
                <div className="card-gradients infos">
                    <div className="card-gradient"></div>
                    <div className="card-gradient"></div>
                </div>
                <div className="card-info flex">
                    <h1>Users</h1>
                    <h3>{loading ? "Loading..." : error ? `Error: ${error}` : data.unique_users}</h3>
                </div>
                {starData.map((star, index) => (
                    <Star
                        key={index}
                        style={{
                            position: 'absolute',
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            width: `${star.size}%`,
                            height: `${star.size}%`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Information;
