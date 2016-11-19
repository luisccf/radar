var titlePadding = 5;

var plotTreemap = function(data, container, title) {
    var visualization = d3plus.viz()
        .container(container)
        .data(data)
        .type('treemap')
        .id('name')
        .size('value')     
        .title({
            'value': title,
            'padding': titlePadding
        })
        .format('pt_BR')
        .draw();
};

var plotPieChart = function(data, container, title) {
    var visualization = d3plus.viz()
        .container(container)
        .data(data)
        .type('pie')
        .id('name')
        .size('value')     
        .title({
            'value': title,
            'padding': titlePadding
        })
        .format('pt_BR')
        .draw();
};

var plotBarChart = function(data, container, title) {
    var visualization = d3plus.viz()
        .container(container)
        .data(data)
        .type('bar')
        .id('name')
        .x({
            'value': 'name',
            'grid': false,
            'axis': false
        })
        .y({
            'value': 'value',
            'grid': false
        })        
        .title({
            'value': title,
            'padding': titlePadding
        })
        .format('pt_BR')
        .draw();
};
