import React from 'react';
import { splitDataIntoYears } from '../tools/dataWranglers';

import petrolData from '../data/petrol';
import Year from './Year';

class Main extends React.Component {
    render() {
        const years = [2015, 2016, 2017, 2018];

        // console.log(petrolData);

        const yearsData = splitDataIntoYears(petrolData, years);

        const yearsOutput = yearsData.map((year, key) => <Year key={key} data={year} />);

        // console.log(yearsData);

        return <main>{yearsOutput}</main>;
    }
}

export default Main;
