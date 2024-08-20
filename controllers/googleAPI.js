const { GoogleAdsApi, enums } = require('google-ads-api');
const { GoogleAuth } = require('google-auth-library');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// const auth = new GoogleAuth({
//   keyFile: path.join(__dirname, '../utils/googleapi.json'), // Ensure the path is correct
//   scopes: 'https://www.googleapis.com/auth/adwords',
// });

async function main(req, res) {

  const client = new GoogleAdsApi({
    client_id: process.env.Google_ClientID,
    client_secret:process.env.Google_client_Secret,
    developer_token: process.env.AdS_developer_Token,
  });

  const { keywords } = req.body;
  console.log(keywords)
  const geoTargetConstants = ['geoTargetConstants/2840']; // United States

  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID, // Replace with your actual customer ID
    login_customer_id: null, // Required if you're using a manager account
    linked_customer_id: null, // Optional
    refresh_token: process.env.Google_refresh_Token || "Yi0UE4zbW_Yc5f2KBn1l7Q",

  });

  const languageConstant = 'languageConstants/1000'; 

  const keywordSeed = {
    keywordSeed: {
      keywords: ['paksitan'], // Ensure these are valid strings
    },
  };
  console.log()

  try {
    const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
      customer_id:process.env.GOOGLE_ADS_CUSTOMER_ID,
      geo_target_constants: geoTargetConstants,
      language: languageConstant,
      keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH,
      keyword_seed: {  // Correct field name
        keywords: keywords || ['independence'], // Ensure this is an array of valid strings
      },
    });
    console.log(response,"responce++++++++++++++++++++++++++++++++++++P__")
    console.log(response.results,"result++++++++++++++++++++++++++++++++++++P__")

    const resultData = response?.map((result) => ({
      keyword: result?.text, // Access directly as it's already a string
      avgMonthlySearches: result.keyword_idea_metrics?.avg_monthly_searches, // Access directly as it's already a string/number
      competition: result.keyword_idea_metrics?.competition, // Access directly as it's already a string
    }));

    res.json(resultData);
  } catch (err) {
    console.error('Failed to generate keyword ideas:', err);
    res.status(500).send(err);
  }
}

module.exports = { main };
