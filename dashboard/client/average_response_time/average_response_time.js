import d3 from 'd3';
import nvd3 from 'nvd3';

Template.averageResponseTime.onRendered(function () {
  // Get reference to template instance
  const templateInstance = Template.instance();

  // Placeholder block
  templateInstance.chartData = new ReactiveVar();

  // Parse chart data reactively
  templateInstance.autorun(() => {
    const elasticsearchData = Template.currentData().aggregations.buckets;

    const chartData = [
      {
        key: 'Time, ms: ',
        values: elasticsearchData
      }
    ];

    // Update chart data reactive variable
    templateInstance.chartData.set(chartData);
  });

  // Initialize chart
  const chart = nvd3.models.historicalBarChart();

  // Set canvas size. TODO: Generate size basing on window size
  const canvasWidth = 400;
  const canvasHeight = 200;

  // Configure chart
  chart
    .x( d => d.key )
    // Parse to int
    .y( d => parseInt(d.percentiles_response_time.values['95.0'], 10))
    .xScale(d3.time.scale())
    .margin({ left: 100, bottom: 100 })
    .useInteractiveGuideline(true);

  // Configure x-axis settings for chart
  chart.xAxis
    .axisLabel('Days')
    // Format dates in m/d/y format
    .tickFormat(d => d3.time.format('%x')(new Date(d)));

  // Configure y-axis settings for chart
  chart.yAxis
    .axisLabel('Time, ms');

  // Render chart reactively
  templateInstance.autorun(() => {
    // Get chart data from reactive variable
    const chartData = templateInstance.chartData.get();

    if (chartData) {
      // Render the chart with data
      d3.select(`[data-id="${templateInstance.data.attr}"] .average-response-time svg`)
        .datum(chartData)
        .attr('width', canvasWidth)
        .attr('height', canvasHeight)
        .call(chart);

      // Make sure chart is responsive (resize)
      nvd3.utils.windowResize(chart.update);
    }
  });
});
