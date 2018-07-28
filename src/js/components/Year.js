import React from 'react';
import Sticky from 'react-sticky-fill';

import FrequencyGraph from './FrequencyGraph';
import PPLGraph from './PPLGraph';
import { topupsPerMonth, spendPerMonth } from '../tools/dataWranglers';

class Year extends React.Component {
    render() {
        const monthlyCount = topupsPerMonth(this.props.data.data);
        const monthlySpend = spendPerMonth(this.props.data.data);
        return (
            <div className="year__wrapper">
                {/*<p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias error ad,
                    dolore quia amet quas tenetur veniam nobis cum quasi laboriosam velit saepe nam,
                    placeat minima et. Ducimus aspernatur, quia?
                </p>*/}
                <div className="year__meta">
                    <Sticky>
                        <div className="year__meta-inner">
                            <h1 className="year__title">{this.props.data.year}</h1>
                            <p>
                                <span className="year__meta-value">{monthlyCount}</span> topups per
                                month
                            </p>
                            <p>
                                <span className="year__meta-value">{monthlySpend}</span> mean topup
                                cost
                            </p>
                        </div>
                    </Sticky>
                </div>
                <div className="year__graphs">
                    <FrequencyGraph data={this.props.data} />
                    <PPLGraph data={this.props.data} />
                </div>
            </div>
        );
    }
}

export default Year;
