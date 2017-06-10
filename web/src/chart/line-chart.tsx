'use strict';
import * as React from 'react';
import { cyan400 as lineColor } from 'material-ui/styles/colors';
import * as d3 from 'd3';
import { Resizable } from '../react-utils';

export type Bucket = { time: number, quantity: number };

type Props = {
  buckets: Bucket[];
  yLabel: string;
};
type State = {};

class LineChart extends React.Component<Props, State> {
  private bounds: ClientRect;
  private svg: SVGSVGElement;
  private readonly margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private get outerWidth() { return this.bounds ? this.bounds.width : 150; }
  private get width() { return this.outerWidth - this.margin.left - this.margin.right; }
  private get outerHeight() { return Math.min(this.outerWidth, 700); }
  private get height() { return this.outerHeight - this.margin.top - this.margin.bottom; }

  private setWidth(div: HTMLDivElement): void {
    if(div) {
      this.bounds = div.getBoundingClientRect();
      this.renderChart();
    }
  }

  private renderChart(el?: SVGSVGElement): void {
    if(el) {
      this.svg = el;
    } else if(this.svg) {
      el = this.svg;
    } else {
      return;
    }
    el.innerHTML = '';
    const svg = d3.select(el);
    const x = d3.scaleTime()
      .rangeRound([0, this.width])
      .domain([
        Math.min(...this.props.buckets.map(_ => _.time)),
        Math.max(...this.props.buckets.map(_ => _.time)),
      ]);
    const y = d3.scaleLinear()
      .domain([0, Math.max(...this.props.buckets.map(_ => _.quantity))])
      .rangeRound([this.height, 0]);
    const line = d3.line<Bucket>()
        .x(d => x(d.time))
        .y(d => y(d.quantity));

    const g = svg
      .attr('width', this.outerWidth)
      .attr('height', this.outerHeight)
      .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    g.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x).ticks(9))
      .select('.domain')
        .remove();
    g.append('g')
        .call(d3.axisLeft(y))
        .append('text')
          .attr('fill', '#000')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .text(this.props.yLabel);
    g.append('path')
      .datum(this.props.buckets)
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }

  render() {
    return (
      <div style={{ width: '100%' }} ref={div => this.setWidth(div)}>
        <svg ref={svg => this.renderChart(svg)}></svg>
      </div>
    );
  }
}

export default Resizable(LineChart);