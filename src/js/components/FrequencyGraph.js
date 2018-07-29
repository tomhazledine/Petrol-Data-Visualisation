import React from 'react';
import * as d3 from 'd3';

class FrequencyGraph extends React.Component {
    constructor() {
        super();

        // Sizes and layout
        this.size = {
            width: 600,
            height: 85
        };
        this.layout = {
            margin: { top: 25, right: 80, bottom: 30, left: 20 }
        };
        this.layout.width = this.size.width - this.layout.margin.left - this.layout.margin.right;
        this.layout.height = this.size.height - this.layout.margin.top - this.layout.margin.bottom;

        // Scales
        this.xScale = d3.scaleTime().range([0, this.layout.width]);
        this.yScale = d3.scaleLinear().range([0, this.layout.height]);

        // Axes
        this.xAxis = d3
            .axisBottom()
            .scale(this.xScale)
            .tickFormat(d3.timeFormat('%b'));

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
        const data = this.props.data.data.map(d => {
            d.date = new Date(d.date * 1000);
            return d;
        });

        this.setState({
            data,
            year: this.props.data.year,
            dateRange: [new Date(this.props.data.year, 0), new Date(this.props.data.year + 1, 0)]
        });
    }

    componentDidMount() {
        d3.select(this.refs.xAxis).call(this.xAxis);
    }

    render() {
        // Scale the range of the data
        this.xScale.domain(d3.extent(this.state.dateRange));
        this.yScale.domain([0, 100]);

        let bars = this.state.data.map((entry, key) => {
            return (
                <rect
                    key={key}
                    className="frequency__bar"
                    width="1"
                    height={this.yScale(100)}
                    y={0}
                    x={this.xScale(entry.date)}
                />
            );
        });

        return (
            <div className="graph__wrapper">
                <div className="graph__title-wrapper">
                    <h2 className="graph__title">Frequency</h2>
                </div>
                <svg width={this.size.width} height={this.size.height} className="frequency__graph">
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
                        <g className="frequency__bars">{bars}</g>
                        <g>
                            <g
                                ref="xAxis"
                                className="frequecy__axis--x"
                                transform={`translate(0,${this.layout.height})`}
                            />
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
}

export default FrequencyGraph;
