import * as React from "react";
import * as d3 from "d3";

type ChartProps = {
  value: number;
  markerWidth?: number;
  meterBroadness?: number;
};

const RiskMeter: React.FunctionComponent<ChartProps> = props => {
  const chartContainer = React.createRef<HTMLDivElement>();
  let x = null;
  let calculatedHeight = 0;

  const prepareChart = () => {
    if (!props.value) return;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const chartWidth: number =
      (chartContainer.current && chartContainer.current.offsetWidth) || 0;
    const chartHeight: number =
      (chartContainer.current && chartContainer.current.offsetHeight) || 0;
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;
    const meterStroke = props.meterBroadness || 8;
    const markWidth = props.markerWidth || 8;
    calculatedHeight = height - markWidth - meterStroke;

    x = d3
      .scaleLinear()
      .rangeRound([0, width])
      .domain([0, 100]);

    const xAxis = g =>
      g
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis x-axis")
        .call(d3.axisBottom(x).tickSizeOuter(meterStroke / 2 + 0.5))
        .call(g => g.selectAll("line").remove())
        .call(g => g.selectAll(".tick").remove())
        .call(g =>
          g
            .selectAll(".domain")
            .attr("stroke", "url(#linear-gradient)")
            .attr("stroke-width", meterStroke)
            .attr("fill", "none")
        );

    d3.select(chartContainer.current)
      .selectAll("svg")
      .remove();
    const svg = d3
      .select(chartContainer.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const areaGradientColor = d3
      .scaleLinear<string>()
      .domain([0, 45, 75, 90, 100])
      .range(["#F44336", "#FFA522", "#FFD500", "#C1EE40", "#4ABF4F"]);
    svg
      .append("linearGradient")
      .attr("id", "linear-gradient")
      .selectAll("stop")
      .data([
        { offset: "0%", color: areaGradientColor(0) },
        { offset: "45%", color: areaGradientColor(45) },
        { offset: "75%", color: areaGradientColor(75) },
        { offset: "90%", color: areaGradientColor(90) },
        { offset: "100%", color: areaGradientColor(100) }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    svg
      .append("polygon")
      .attr("points", `0 0, ${markWidth} ${markWidth}, ${markWidth * 2} 0, 0 0`)
      .attr("transform", `translate(${x(props.value)}, ${calculatedHeight})`)
      .attr("color", "black");

    svg.append("g").call(xAxis);
  };

  const updateValue = newValue => {
    d3.select(chartContainer.current)
      .select("polygon")
      .transition()
      .duration(200)
      .attr("transform", `translate(${x(newValue)}, ${calculatedHeight})`);
  };

  React.useEffect(() => {
    prepareChart();
  }, [props.markerWidth, props.meterBroadness]);

  React.useEffect(() => {
    updateValue(props.value);
  }, [props.value]);

  return <div className="chart-container" ref={chartContainer as any} />;
};

export default RiskMeter;
