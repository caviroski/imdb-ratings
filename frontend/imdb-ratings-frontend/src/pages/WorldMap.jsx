import React, { useEffect, useState } from 'react';
import { ResponsiveChoropleth } from '@nivo/geo';
import worldFeatures from './world_countries.json'; // or fetch from a source

export default function WorldMapChoropleth() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/country-counts')
      .then(res => res.json())
      .then(arr => {
        const formatted = arr.map(item => ({
          id: item.country, value: item.count,
        }));
        setData(formatted);
      });
  }, []);

  return (
    <ResponsiveChoropleth
      data={data}
      features={worldFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={['auto', 'auto']}
      unknownColor="#EEE"
      label="properties.name"
      projectionScale={150}
      projectionTranslation={[0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      fillColor={(feature) => {
        const d = data.find(d => d.id === feature.properties.name);
        return d ? `rgba(0, 122, 204, ${0.2 + (d.value / 100)})` : '#EEE';
      }}
      borderColor="#999"
      legends={[
        {
          anchor: 'bottom-left',
          direction: 'column',
          translateX: 20,
          translateY: -60,
          itemWidth: 94,
          itemHeight: 18,
          itemsSpacing: 0,
          symbolSize: 18,
          effects: [{ on: 'hover', style: { itemTextColor: '#000' } }],
        },
      ]}
    />
  );
}
