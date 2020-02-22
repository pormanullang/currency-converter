const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) =>{
	//try{
		const res = await axios.get(`http://api.currencylayer.com/live?access_key=1f5ddc9afc9bc208ddb9060fa408eeb9&format=1`);
		const usd = 1 / res.data.quotes[`USD${fromCurrency}`];
		const exchangeRate = usd * res.data.quotes[`USD${toCurrency}`];

		return exchangeRate;
// 	}catch(error){
// 		throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
// 	}
};

const getCountries = async (currencyCode) =>{
	try{
		const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);

		return res.data.map(country=>country.name);
	}catch(error){
		throw new Error(`Unable to get countries that use ${currencyCode}`);
	}
};

const convertCurrency = async (fromCurrency, toCurrency, amount) =>{
	let exchangeRate;
  	let countries;

  	await Promise.all([getExchangeRate(fromCurrency, toCurrency), getCountries(toCurrency)])
    	.then(([exchangeRateValue, countriesValue]) => {
      	exchangeRate = exchangeRateValue;
      	countries = countriesValue;
    	});

  	const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

convertCurrency('SGD', 'IDR', 1)
  .then((message) => {
    console.log(message);
  }).catch((error) => {
    console.log(error.message);
  });