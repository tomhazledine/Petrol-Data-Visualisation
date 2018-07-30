import React from 'react';
import * as d3 from 'd3';
import { parseCurrency, mode, median, mean } from '../tools/dataHelpers';
import { sortByAlternateKey } from '../tools/dataWranglers';

class PPLGraph extends React.Component {
    constructor() {
        super();

        // Sizes and layout
        this.size = {
            width: 600,
            height: 200
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
            .tickFormat(d => parseCurrency(d, 3, 2));

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
        // Scale the range of the data
        this.xScale.domain(d3.extent(this.state.dateRange));
        // this.yScale.domain([0, d3.max(this.state.data, d => d.ppl)]);
        this.yScale.domain([850, 1400]);
        // this.yScale.domain([0, 1400]);

        // Define the line generator
        this.lineGenerator
            .defined(d => typeof d.ppl === 'number')
            .x(d => this.xScale(d.date))
            .y(d => this.yScale(d.ppl));
        // .curve(d3.curveCatmullRom.alpha(0.5));

        // console.log(this.layout);

        let lineData = this.lineGenerator(this.state.data);
        let line = <path d={lineData} className="line" fill="none" stroke="#000000" />;

        let dots = this.state.data.map((entry, key) => {
            if (typeof entry.ppl !== 'undefined') {
                return (
                    <circle
                        key={key}
                        r="2"
                        transform={`translate(${this.xScale(entry.date)},${this.yScale(
                            entry.ppl
                        )})`}
                        className="circle"
                    />
                );
            }
        });

        const valuesArray = this.state.data
            .filter(entry => typeof entry.ppl !== 'undefined')
            .map(entry => entry.ppl);

        const averages = [
            // { key: 'mean', value: mean(valuesArray) },
            // { key: 'mode', value: mode(valuesArray) },
            { key: 'median', value: median(valuesArray) }
        ];

        const averageLines = averages.map((item, key) => {
            return (
                <g key={key}>
                    <text
                        x="0"
                        y={this.yScale(item.value)}
                        // textLength={this.layout.width}
                        className={`average-line__text average-line__text--${item.key}`}
                    >
                        {item.key}
                    </text>
                    <rect
                        className={`average-line average-line--${item.key}`}
                        height="1"
                        width={this.layout.width}
                        y={this.yScale(item.value)}
                        x="0"
                    />
                </g>
            );
        });

        const markers = [900, 1000, 1100, 1200, 1300];

        const makersLines = markers.map((marker, key) => (
            <rect
                key={key}
                className={`graph__marker ${marker === 1000 ? 'graph__marker--strong' : ''}`}
                height="1"
                width={this.layout.width}
                y={this.yScale(marker)}
                x="0"
            />
        ));

        return (
            <div className="graph__wrapper">
                <div className="graph__title-wrapper">
                    <h3 className="graph__title">Price Per Litre</h3>
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
                        <g className="ppl__lines">
                            {averageLines}
                            {/*line*/}
                        </g>
                        <g className="ppl__dots">{dots}</g>
                        <g>
                            <g
                                ref="xAxis"
                                className="axis axis--x ppl__axis--x"
                                transform={`translate(0,${this.layout.height})`}
                            />
                            <g
                                ref="yAxis"
                                className="axis axis--y ppl__axis--y"
                                transform={`translate(${this.layout.width},0)`}
                            />
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
}

export default PPLGraph;
