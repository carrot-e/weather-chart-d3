(() => {
    const apiUrl = '/api/weather';
    const duration = 500;
    const hiddenContainer = d3.select('#container-hidden');

    handler();
    get('Kiev');

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

    function handler() {
        d3.select('#switcher')
            .on('change', function() {
                let city = d3.select(this)
                    .property('value');
                get(city);
            });
    }

    function get(city) {
        return axios.get(`${apiUrl}/${city}`)
            .then(data => {
                if (d3.select('svg').empty()) {
                    d3.select('#container')
                        .html(data.data)
                        .select('svg')
                        .call(responsivefy);
                }
                hiddenContainer
                    .html(data.data);

                d3.select('#container')
                    .selectAll('circle')
                    .transition()
                    .duration(duration)
                    .attr('cy', function(d, i) {
                        return hiddenContainer.select(`circle:nth-of-type(${i + 1})`).attr('data-cy');
                    });

                d3.select('.path')
                    .transition()
                    .duration(duration)
                    .attr('d', function() {
                        return hiddenContainer.select('.path').attr('data-d')
                    });

                d3.select('.area')
                    .transition()
                    .duration(duration)
                    .attr('d', function() {
                        return hiddenContainer.select('.area').attr('data-d')
                    })
            });
    }
})();
