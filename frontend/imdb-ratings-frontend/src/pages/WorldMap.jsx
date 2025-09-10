import { useEffect, useState } from 'react';

import { ResponsiveChoropleth } from '@nivo/geo';

import worldFeatures from '../data/world_countries.json';
import { fetchCountryCounts } from '../api/fetchCountryCounts';

export const countryMapping = {
    'United States': 'USA',
    'United Kingdom': 'GBR',
    'Japan': 'JPN',
    'Australia': 'AUS',
    'South Africa': 'ZAF',
    'India': 'IND',
    'Mexico': 'MEX',
    'Sweden': 'SWE',
    'Germany': 'DEU',
    'France': 'FRA',
    'Canada': 'CAN',
    'Poland': 'POL',
    'Italy': 'ITA',
    'North Macedonia': 'MKD',
    'Spain': 'ESP',
    'New Zealand': 'NZL',
    'Austria': 'AUT',
    'Denmark': 'DNK',
    'Chile': 'CHL',
    'Finland': 'FIN',
    'South Korea': 'KOR',
    'Ireland': 'IRL',
    'Russia': 'RUS',
    'Lebanon': 'LBN',
    'Romania': 'ROU',
    'Serbia': 'SRB',
    'Norway': 'NOR',
    'Greece': 'GRC',
    'Slovenia': 'SVN',
    'Jamaica': 'JAM',
    'Bosnia and Herzegovina': 'BIH',
    'Argentina': 'ARG',
    'Pakistan': 'PAK',
    'Israel': 'ISR',
    'Iran': 'IRN',
    'Iceland': 'ISL',
    'Netherlands': 'NLD',
    'Thailand': 'THA',
    'Belgium': 'BEL',
    'Luxembourg': 'LUX',
    'Czech Republic': 'CZE',
    'Brazil': 'BRA',
    'Croatia': 'HRV',
    'Switzerland': 'CHE',
    // Historical countries mapped to their modern equivalents
    'West Germany': 'DEU',
    'Soviet Union': 'RUS',
    'Yugoslavia': 'SRB',
    'Socialist Federal Republic of Yugoslavia': 'SRB',
    'Federal Republic of Yugoslavia': 'SRB',
    'German Reich': 'DEU',
    'Socialist Republic of Macedonia': 'MKD',
    "People's Republic of China": 'CHN',
    'Hong Kong': 'CHN'
  };

export default function WorldMap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCountryCounts()
      .then((arr) => {
        const formatted = arr.map((item) => ({
          id: countryMapping[item.country] || item.country,
          value: item.count
        }));
        setData(formatted);
      }).catch(console.error);
  }, []);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ResponsiveChoropleth
        data={data}
        features={worldFeatures.features}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        domain={[0, 100]}  // range of values for your colors
        unknownColor="#fff"
        label="properties.name"
        projectionScale={150}
        projectionTranslation={[0.5, 0.5]}
        projectionRotation={[0, 0, 0]}
        colors="blues"        // built-in color scheme
        borderWidth={1.5}
        borderColor="#333"
      />
    </div>
  );
}
