import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/linechart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState();
  const [historicalData, setHistoricalData] = useState();
  const { currency } = useContext(CoinContext);

  // Fetch detailed coin data
  const fetchCoinData = async () => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
        }
      });
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY }
      });
      const data = await res.json();
      setHistoricalData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch whenever coinId or currency changes
  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [coinId, currency]);

  // Show spinner until data is loaded
  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coinName">
        <img src={coinData.image?.large} alt={coinData.name} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol.toUpperCase()})
          </b>
        </p>
      </div>

      <div className="coinchart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coinInfo">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>
            {currency.symbol}{' '}
            {coinData.market_data?.current_price?.[currency.name]?.toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>
            {currency.symbol}{' '}
            {coinData.market_data?.market_cap?.[currency.name]?.toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>
            {currency.symbol}{' '}
            {coinData.market_data?.high_24h?.[currency.name]?.toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>
            {currency.symbol}{' '}
            {coinData.market_data?.low_24h?.[currency.name]?.toLocaleString()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
