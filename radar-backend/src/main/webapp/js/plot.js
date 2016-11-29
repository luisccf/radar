var titlePadding = 5;

var plotTreemap = function(data, container, title) {
    var visualization = d3plus.viz()
        .container(container)
        .data(data)
        .type('tree_map')
        .id('name')
        .size('value')     
        .title({
            'value': title,
            'font': {'size': 20},
            'padding': titlePadding
        })
        .labels({
            'align': 'left', 
            'valign': 'top'
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

var plotBarChart = function(data, container, title, xlabel, ylabel) {
    var order = data.map(function(d){ return d.id; });

    var visualization = d3plus.viz()
        .container(container)
        .data(data)
        .type('bar')
        .id({'value': 'name', 'label': 'Nome'})
        .x({
            'value': 'name',
            'grid': false,
            'axis': false,
            'label': xlabel
        })
        .y({
            'value': 'value',
            'grid': false,
            'label': ylabel
        })        
        .title({
            'value': title,
            'padding': titlePadding
        })
        .order({
            'sort': 'desc',
            'value': function(d) { return order.indexOf(d); }
          })
        .format('pt_BR')
        .draw();
};
