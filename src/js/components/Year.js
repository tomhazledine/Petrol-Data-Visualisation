import React from 'react';
import Sticky from 'react-sticky-fill';

import FrequencyGraph from './FrequencyGraph';
import MonthlyBars from './MonthlyBars';
import PPLGraph from './PPLGraph';
import pump from '../../icons/pump.svg';
import { totalSpend, topupsPerMonth, spendPerMonth } from '../tools/dataWranglers';
import { parseCurrency } from '../tools/dataHelpers';

class Year extends React.Component {
    render() {
        const monthlyCount = topupsPerMonth(this.props.data.data);
        const monthlySpend = spendPerMonth(this.props.data.data);
        const total = totalSpend(this.props.data.data);
        return (
            <div className="year__wrapper">
                <div className="year__divider">
                    <svg className="year__divider-icon">
                        <use xlinkHref={`#${pump.id}`} />
                    </svg>
                </div>
                <div className="year__meta">
                    <Sticky>
                        <div className="year__meta-inner">
                            <h2 className="year__title">{this.props.data.year}</h2>
                            <p>
                                <span className="year__meta-value">{monthlyCount}</span> topups per
                                month
                            </p>
                            <p>
                                <span className="year__meta-value">{monthlySpend}</span> mean topup
                                cost
                            </p>
                            <p>
                                <span className="year__meta-value">{parseCurrency(total)}</span>{' '}
                                spent this year
                            </p>
                        </div>
                    </Sticky>
                </div>
                <div className="year__graphs">
                    <FrequencyGraph data={this.props.data} />
                    <MonthlyBars data={this.props.data} />
                    <PPLGraph data={this.props.data} />
                </div>
            </div>
        );
    }
}

export default Year;
