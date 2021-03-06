import React from 'react';
import * as d3 from 'd3';
import { parseCurrency, mode, median, mean } from '../tools/dataHelpers';
import { sortByAlternateKey } from '../tools/dataWranglers';

class MonthlyBars extends React.Component {
    constructor() {
        super();

        // Sizes and layout
        this.size = {
            width: 600,
            height: 150
        };
        this.layout = {
            margin: { top: 4, right: 80, bottom: 30, left: 6 }
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
            .ticks(3)
            .tickFormat(d3.timeFormat('%b'));
        this.yAxis = d3
            .axisRight()
            .scale(this.yScale)
            .ticks(4)
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

        let monthlyResults = monthlyData.map((month, key) => {
            let totalSpend = month.reduce((acc, entry) => acc + entry.petrol, 0);
            return {
                month: key,
                count: month.length,
                total: totalSpend,
                medianSpend: Math.round(totalSpend / 4)
            };
        });

        monthlyResults = monthlyResults.filter(item => item.medianSpend > 0);

        // console.log(monthlyResults);

        // Scale the range of the data
        this.xScale.domain(d3.extent(this.state.dateRange));
        // this.yScale.domain([0, d3.max(this.state.data, d => d.ppl)]);
        this.yScale.domain([0, 40000]);

        const bars = monthlyResults.map((month, key) => {
            let barHeight = this.yScale(month.total);
            // console.log('barHeight', barHeight);
            let x1 = this.xScale(new Date(this.state.year, month.month));
            let x2 = this.xScale(new Date(this.state.year, month.month + 1));
            let width = x2 - x1;
            return (
                <g key={key} className="monthly__bar-wrapper">
                    <rect
                        className="monthly__bar"
                        height={this.layout.height - barHeight}
                        width={width - 1}
                        x={x1}
                        y={barHeight}
                    />
                    <text
                        className="monthly__bar-label"
                        x={x1 + width / 2}
                        y={barHeight}
                        width={x2 - x1}
                        textAnchor="middle"
                    >
                        {parseCurrency(month.total, 2, 0)}
                    </text>
                </g>
            );
        });

        const markers = [10000, 20000, 30000];

        const makersLines = markers.map((marker, key) => (
            <rect
                key={key}
                className="graph__marker"
                height="1"
                width={this.layout.width}
                y={this.yScale(marker)}
                x="0"
            />
        ));

        return (
            <div className="graph__wrapper">
                <div className="graph__title-wrapper">
                    <h3 className="graph__title">Monthly spend (£)</h3>
                </div>
                <svg width={this.size.width} height={this.size.height}>
                    <g
                        transform={`translate(${this.layout.margin.left},${
                            this.layout.margin.top
                        })`}
                    >
                        <rect
                            className="graph__background"
                            height={this.layout.height}
                            width={this.layout.width}
                        />
                        <g className="graph__markers">{makersLines}</g>
                        <g className="monthly__bars">{bars}</g>
                        <g>
                            <g
                                ref="xAxis"
                                className="axis axis--x monthly__axis monthly__axis--x"
                                transform={`translate(0,${this.layout.height})`}
                            />
                            <g
                                ref="yAxis"
                                className="axis axis--y monthly__axis monthly__axis--y"
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
