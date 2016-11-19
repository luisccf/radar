$(function() {
    loadTemplate();
    // loadCriminalsStats();

/* FOR TESTING */

    // Creates alone plot 
    var data = [
        {'name': 'Sim', 'value': 30},
        {'name': 'Não', 'value': 20}
    ];
    plotTreemap(data, '#alone-viz', 'O assaltante estava sozinho?');

    // Creates armed plot 
    var data = [
        {'name': 'Desarmado', 'value': 10},
        {'name': 'Arma de fogo', 'value': 4},
        {'name': 'Arma branca', 'value': 9}
    ];
    plotTreemap(data, '#armed-viz', 'Como o assaltante estava armado?');

    // Creates transport plot 
    var data = [
        {'name': 'Carro', 'value': 5},
        {'name': 'Bicicleta', 'value': 11},
        {'name': 'A pé', 'value': 25},
        {'name': 'Skate', 'value': 1},
        {'name': 'Ônibus', 'value': 3},
        {'name': 'Patinete', 'value': 4}
    ];
    plotTreemap(data, '#transport-viz', 'Qual o meio de transporte do assaltante?');

});

var loadCriminalsStats = function() {
    $.ajax({
        url: '/statistics/criminals/alone',
        success: function(data) {
            plotPieChart(data, '#alone-viz', 'O assaltante estava sozinho?');
        }
    });

    $.ajax({
        url: '/statistics/criminals/armed',
        success: function(data) {
            plotPieChart(data, '#armed-viz', 'Como o assaltante estava armado?');
        }
    });

    $.ajax({
        url: '/statistics/criminals/transport',
        success: function(data) {
            plotTreemap(data, '#transport-viz', 'Qual o meio de transporte do assaltante?');
        }
    });
};
