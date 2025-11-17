'use client';

import { useLang } from '@/store/useLang';
import { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';

// Define TypeScript interfaces for API response
interface ExchangeRateResponse {
  result: string;
  conversion_rates: {
    USD: number;
    GBP: number;
  };
}

// Map lang to currency
const currencyMap: Record<string, string> = {
  en: 'USD',
  se: 'SEK',
  gb: 'GBP',
};

// Map currency to symbol
const symbolMap: Record<string, string> = {
  USD: '$',
  SEK: 'kr',
  GBP: '£',
};

const Price: React.FC = () => {
  const [basePrice] = useState<number>(100); // Fixed base price in SEK (customize as needed)
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { lang } = useLang();
  const { t } = useTranslation();
  // Get target currency based on lang
  const [targetCurrency, setTargetCurrency] = useState(currencyMap[lang]);

  // Function to fetch exchange rates and calculate price
  const fetchExchangeRate = async (price: number, currency: string) => {
    // If currency is SEK, no conversion needed
    if (currency === 'SEK') {
      setConvertedPrice(price);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const apiKey = 'b77ec85cf5cf5d332499daee';
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/SEK`;

    try {
      const response = await fetch(url);
      const data: ExchangeRateResponse = await response.json();

      if (data.result === 'success') {
        const rate = data.conversion_rates[currency as keyof typeof data.conversion_rates];
        setConvertedPrice(price * rate);
      } else {
        setError('Failed to fetch exchange rates.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Error fetching exchange rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch rate when lang changes
  useEffect(() => {
    if (basePrice > 0) {
      fetchExchangeRate(basePrice, targetCurrency);
    }
  }, [basePrice, targetCurrency]);

  useEffect(() => {
    setTargetCurrency(currencyMap[lang])
  }, [lang])

  return (
    <div className="text-2xl">
      {/* Display converted price */}
      {loading && <p>{t("Loading")}...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {convertedPrice !== null && !loading && !error && (
        <p>
          {targetCurrency}: {symbolMap[targetCurrency]}
          {convertedPrice.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default memo(Price);