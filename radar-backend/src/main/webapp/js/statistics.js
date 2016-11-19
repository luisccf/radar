$(function() {
    loadTemplate('#to-statistics');

    $('#statistics-select').on('change', function() {

    });

    // Creates gender plot
    var data = [
        {'name': 'Masculino', 'value': 12},
        {'name': 'Feminino', 'value': 15},
        {'name': 'Outro', 'value': 3}  
    ];
    plotTreemap(data, '#gender-viz', 'Ocorrências por gênero da vítima')

    // Creates color plot 
    var data = [
        {'name': 'Branca', 'value': 10},
        {'name': 'Azul', 'value': 15},
        {'name': 'Parda', 'value': 3},
        {'name': 'Preta', 'value': 3}, 
        {'name': 'Amarela', 'value': 5}  
    ];
    plotTreemap(data, '#color-viz', 'Ocorrências por cor da vítima')

    // Creates age plot
    var data = [
        {'name': '13 a 24', 'value': 10},
        {'name': '25 a 36', 'value': 20},
        {'name': '37 a 48', 'value': 3},
        {'name': '49 a 60', 'value': 0}, 
        {'name': '61 a 72', 'value': 1},
        {'name': 'maior que 72', 'value': 1}  
    ];
    plotTreemap(data, '#age-viz', 'Ocorrências por idade da vítima')

});

var plotTreemap = function(data, container, title) {
    var visualization = d3plus.viz()
        .container(container)
        .data(data)
        .type('treemap')
        .id('name')
        .size('value')     
        .title({
            'value': title,
            'padding': 10
        })
        .draw();
};

var plotBar = function(data, container, title) {
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
            'padding': 10
        })
        .draw();
};

var loadVictimsStats = function() {
    $.ajax({
        url: '/statistics/victims/gender',
        success: function(data) {
            plotBar('#gender-viz', 'gender', data);
        }
    });

};

