$(function() {
    loadTemplate('#to-statistics');

    $('#statistics-select').on('change', function() {

    });

    var data = [
        {'gender': 'Masculino', 'name': 'Masculino', 'value': 12},
        {'gender': 'Feminino', 'name': 'Feminino', 'value': 15},
        {'gender': 'Outro', 'name': 'Outro', 'value': 3}  
    ];
    plotd3('#gender-viz', 'bar', data);
});

var plotd3 = function(viz, type, data) {
    var visualization = d3plus.viz()
        .container(viz)
        .data(data)
        .type(type)
        .id('name')
        .x('gender')
        .y('value')
        .title('Ocorrências por gênero da vítima')
        .draw();
};

var loadVictimsStats = function() {
    $.ajax({
        url: '/statistics/victims/gender',
        success: function(data) {
            plotd3('#gender-viz', 'bar', data);
        }
    });

};

