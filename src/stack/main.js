define(['stack/stack',
        'jquery',
        'common/legend',
        'data/loaders',
        'data/helpers'],function(stack,$,legend,dataLoaders,dataHelpers)
{
    var data = dataLoaders.complexityExample();

    var metric = 'functions';

    var legendDiv = $('#stack-chart-legend')[0];
    var canvasDiv = $('#stack-chart-canvas')[0];

    var nodeColorScale = ['#a50026',
                          '#d73027',
                          '#f46d43',
                          '#fdae61',
                          '#fee08b',
                          '#d9ef8b',
                          '#a6d96a',
                          '#66bd63',
                          '#1a9850',
                          '#006837'].reverse()


    function legendTitle(d,e){
        return d.path;
    }

    function legendContent(d,e){
        return "<div> \
            <table class=\"table table-striped\"> \
                <tbody> \
                    <tr> \
                        <td>lines of code</td> \
                        <td>"+d.data[metric].total_number_of_lines+"</td> \
                    </tr> \
                    <tr> \
                        <td>total complexity</td> \
                        <td>"+d.data[metric].total_cyclomatic_complexity+"</td> \
                    </tr> \
                    <tr> \
                        <td>complexity / 100 lines of code</td> \
                        <td>"+Math.ceil(d.data[metric].total_cyclomatic_complexity/d.data[metric].total_number_of_lines*100)+"</td> \
                    </tr> \
                </tbody> \
            </table> \
        </div>";
    }


    function nodeColor(d) {
      return d.data[metric].total_cyclomatic_complexity/d.data[metric].total_number_of_lines;
    }

    function nodeValue(d) {
      return d.data[metric].total_number_of_lines;
    }

    var graphParams = {
        legend: legend(legendDiv,legendTitle,legendContent),
        height: 600
    };

    var mapperParams = {
        mappers: {
            value: nodeValue,
            colorValue: nodeColor,
            title: function(d){return d.key.split('/').slice(-1)[0];},
            path: function(d){return d.key;}
        },
        split: function(key){return key.split('/')
    }};

    data.then(
        function(d){
            var treeData = dataHelpers.convertToTree(d,mapperParams);
            //we add color to the elements (using the min/max information)
            dataHelpers.colorize(treeData,'colorValue',nodeColorScale);
            stack.stack($('#stack-chart')[0], treeData, graphParams);
        });

});