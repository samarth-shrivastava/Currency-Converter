import React, { useState, useEffect } from 'react';
import './styles.css';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [exchangeRate, setExchangeRate] = useState(1);
    const [currencies, setCurrencies] = useState([]);

    // Fetch all currencies and set initial exchange rate on component mount
    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
                const data = await response.json();
                setCurrencies(Object.keys(data.rates)); // Set currencies as an array of keys (currency codes)
            } catch (error) {
                console.error("Error fetching currencies:", error);
            }
        };
        fetchCurrencies();
    }, []);

    // Fetch exchange rate whenever `fromCurrency` or `toCurrency` changes
    useEffect(() => {
        const fetchExchangeRate = async () => {
            if (fromCurrency === toCurrency) {
                setExchangeRate(1);
                return;
            }
            try {
                const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
                const data = await response.json();
                setExchangeRate(data.rates[toCurrency]);
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
                setExchangeRate(null);
            }
        };
        fetchExchangeRate();
    }, [fromCurrency, toCurrency]);

    // Handle amount change
    const handleAmountChange = (e) => setAmount(e.target.value);

    // Calculate converted amount
    const calculateConversion = () => (exchangeRate ? (amount * exchangeRate).toFixed(2) : "Error");

    const currencySymbols = ['$', '€', '£', '¥', '₹', '₿', '$', '€', '£', '¥', '₹', '₿', '$', '€', '£'];

    return (
        <>
            {currencySymbols.map((symbol, index) => (
                <div key={index} className="currency-symbol">
                    {symbol}
                </div>
            ))}
            <div className="container">
                <div className="converter-card max-w-md w-full p-8">
                    <h1 className="title text-3xl font-bold text-center mb-8">Currency Converter</h1>
                    
                    <div className="flex flex-col mb-6">
                        <label className="text-sm font-medium text-gray-600 mb-2">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            className="input-field p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-2 block">From</label>
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="currency-select w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {currencies.map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-2 block">To</label>
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="currency-select w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {currencies.map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-medium text-gray-800">Converted Amount:</p>
                            <p className="text-3xl font-bold text-black-800">{calculateConversion()} {toCurrency}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CurrencyConverter;
