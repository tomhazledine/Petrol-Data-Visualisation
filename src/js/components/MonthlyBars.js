import React from 'react';
import * as d3 from 'd3';
import { parseCurrency, mode, median, mean } from '../tools/dataHelpers';
import { sortByAlternateKey } from '../tools/dataWranglers';

class MonthlyBars extends React.Component {
    constructor() {
        super();

        // Sizes and layout
        this.size = {
            width: 460,
            height: 150
        };
        this.layout = {
            margin: { top: 10, right: 80, bottom: 30, left: 20 }
        };
        this.layout.width = this.size.width - this.layout.margin.left - this.layout.margin.right;
        this.layout.height = this.size.height - this.layout.margin.top - this.layout.margin.bottom;

        // Scales
        this.xScale = d3.scaleTime().range([0, this.layout.width]);
        this.yScale = d3.scaleLinear().range([this.layout.height, 0]);

        // Axes
        this.xAxis = d3
            .axisBottom()
            .scale(this.xScale)
            .tickFormat(d3.timeFormat('%b'));
        this.yAxis = d3
            .axisRight()
            .scale(this.yScale)
            .tickFormat(d => parseCurrency(d, 2, 0));

        // Line generator
        this.lineGenerator = d3.line();

        // Date Range
        this.range = [];

        this.state = {
            data: [],
            year: 0,
            dateRange: []
        };
    }

    componentWillMount() {
        // Get the data
        let data = this.props.data.data;

        data = sortByAlternateKey(data, 'date');

        this.setState({
            data,
            year: this.props.data.year,
            dateRange: [new Date(this.props.data.year, 0), new Date(this.props.data.year + 1, 0)]
        });
    }

    componentDidMount() {
        d3.select(this.refs.xAxis).call(this.xAxis);
        d3.select(this.refs.yAxis).call(this.yAxis);
    }

    render() {
        const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        const monthlyData = months.map(month =>
            this.state.data.filter(item => item.date.getMonth() === month)
        );

        const monthlyResults = monthlyData.map((month, key) => {
            let totalSpend = month.reduce((acc, entry) => acc + entry.petrol, 0);
            return {
                month: key,
                count: month.length,
                total: totalSpend,
                medianSpend: Math.round(totalSpend / month.length)
            };
        });

        console.log(monthlyResults);

        // Scale the range of the data
        this.xScale.domain(d3.extent(this.state.dateRange));
        // this.yScale.domain([0, d3.max(this.state.data, d => d.ppl)]);
        this.yScale.domain([0, 7000]);

        const bars = monthlyResults.map((month, key) => {
            let barHeight = this.yScale(month.medianSpend);
            console.log('barHeight', barHeight);
            return (
                <rect
                    key={key}
                    className="ppl__bar"
                    height={this.layout.height - barHeight}
                    width={this.layout.width / 12}
                    x={this.xScale(new Date(this.state.year, month.month))}
                    y={barHeight}
                />
            );
        });

        return (
            <div className="graph__wrapper">
                <div className="graph__title-wrapper">
                    <h2 className="graph__title">Price Per Litre</h2>
                </div>
                <svg width={this.size.width} height={this.size.height}>
                    <g
                        transform={`translate(${this.layout.margin.left},${
                            this.layout.margin.top
                        })`}
                    >
                        {/*<g className="markers">
                            <rect
                                className="marker"
                                height="1"
                                width={this.layout.width}
                                y={this.yScale(1000)}
                                x="0"
                            />
                        </g>*/}
                        <g className="ppl__bars">{bars}</g>
                        <g>
                            <g
                                ref="xAxis"
                                className="ppl__axis--x"
                                transform={`translate(0,${this.layout.height})`}
                            />
                            <g
                                ref="yAxis"
                                className="ppl__axis--y"
                                transform={`translate(${this.layout.width},0)`}
                            />
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
}

export default MonthlyBars;
