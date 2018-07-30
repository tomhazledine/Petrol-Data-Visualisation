import React from 'react';
import ReactMarkdown from 'react-markdown';

import bmw120i from '../../icons/bmw_120i.svg';
import home from '../../icons/home.svg';
import { totalSpend } from '../tools/dataWranglers';
import { parseCurrency } from '../tools/dataHelpers';

const text = `
Since I began commuting by car in 2015, I've kept a record of every single petrol top-up. Finding the right way to visualize this data was an interesting challenge. It was tempting to simply plot the cost of every transaction in a line graph, but that didn't tell me anything useful. Each transaction is independent of all the others; there's no causal link between the amount I spend in one week vs. the amount I spend in the next. So linking them with a single line wasn't telling me any kind of story. In the end, a composite approach provided the most interest.

The factors that turned out to be the most decisive were the **cost of the petrol** (in Price-Per-Litre) and the **frequency** of top-ups. PPL is a function of the wider economy, and the frequency is a function of how much I was driving and what car I was using. A larger car (with a larger fuel tank) decreases the need to top-up, but driving longer distances causes frequency to rise.

It was sobering to see the instant effect of switching from a small, economical car to a larger, sportier (more fun!) one in Nov 2015. But also refreshing to see the direct impact of working more days at home in 2018 (compared to the preceding five months where I'd been driving in every week day).
`;

class Header extends React.Component {
    // componentWillMount() {
    //     fetch('./src/text/intro.md')
    //         .then(response => response.text())
    //         .then(text => {
    //             this.setState({ terms: text });
    //         });
    // }
    render() {
        // console.log(this.props.data);
        const total = totalSpend(this.props.data);
        return (
            <div className="header">
                <div className="header__home">
                    <a href="https://tomhazledine.com">
                        <span className="home__prompt">Back to tomhazledine.com</span>
                        <svg className="home__icon">
                            <use xlinkHref={`#${home.id}`} />
                        </svg>
                    </a>
                </div>
                <div className="header__content">
                    <h1 className="header__title">I spend way too much on petrol...</h1>
                    <ReactMarkdown source={text} />
                </div>
                <div className="header__summary">
                    <span className="header__meta-value">{parseCurrency(total, 2, 2)}</span>
                    <span className="header__meta-label">spent on petrol since Oct 2015</span>

                    <span className="header__meta-value">{this.props.data.length}</span>
                    <span className="header__meta-label">total top-ups</span>

                    <div className="cars">
                        <svg className="car car--120i">
                            <use xlinkHref={`#${bmw120i.id}`} />
                        </svg>
                        <div className="car__meta">
                            <span className="car__name">BMW 120i sport</span>
                            <span className="car__engine">2.0l</span>
                            <span className="car__bhp">196bhp</span>
                            <span className="car__year">2005</span>
                            <span className="car__dates">Oct 2016 - Mar 2018</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
