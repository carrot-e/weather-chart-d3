(() => {
    const apiUrl = '/api/weather';
    const duration = 500;

    function responsivefy(svg) {
        // get container + svg aspect ratio
        var container = d3.select(svg.node().parentNode),
            width = parseInt(svg.style("width")),
            height = parseInt(svg.style("height")),
            aspect = width / height;

        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg.attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMinYMid")
            .call(resize);

        // to register multiple listeners for same event type,
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on("resize." + container.attr("id"), resize);

        // get width of container and resize svg to fit it
        function resize() {
            var targetWidth = parseInt(container.style("width"));
            svg.attr("width", targetWidth);
            svg.attr("height", Math.round(targetWidth / aspect));
        }
    }

    return axios.get(apiUrl)
        .then(data => {
            d3.select('#container')
                .html(data.data)
                .select('svg')
                .call(responsivefy)
                .selectAll('circle')
                .transition()
                    .duration(duration)
                    .attr('cy', function() {
                        return d3.select(this).attr('data-cy');
                    });

            d3.select('.path')
                .transition()
                    .duration(duration)
                    .attr('d', function() {
                        return d3.select(this).attr('data-d')
                    });
        });
})();
