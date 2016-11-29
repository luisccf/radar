$(function() {
    loadTemplate();
    loadCircumstancesStats();

// /* FOR TESTING */

//     // Creates period plot 
//     var data = [
//         {'name': 'Madrugada', 'value': 10},
//         {'name': 'Tarde', 'value': 20},
//         {'name': 'Manhã', 'value': 20},
//         {'name': 'Noite', 'value': 50}
//     ];
//     plotTreemap(data, '#period-viz', 'Quando o incidente ocorreu?');

//     // Creates objects taken plot 
//     var data = [
//         {'name': 'iPhone', 'value': 10},
//         {'name': 'iPhone 5', 'value': 4},
//         {'name': 'Nada', 'value': 9},
//         {'name': 'Samsung Galaxy S7', 'value': 2},
//         {'name': 'iPad 2', 'value': 2},
//         {'name': 'MacBook Pro', 'value': 1},
//         {'name': 'Dinheiro', 'value': 40},
//         {'name': 'nada kkk', 'value': 20},
//         {'name': 'Carteira', 'value': 45},
//         {'name': 'Fone de ouvido', 'value': 15}
//     ];
//     plotTreemap(data, '#objects-taken-viz', 'Quais os objectos mais levados pelos assaltantes?');

//     // Creates transport plot 
//     var data = [
//         {'name': 'Carro', 'value': 5},
//         {'name': 'Bicicleta', 'value': 11},
//         {'name': 'A pé', 'value': 25},
//         {'name': 'Skate', 'value': 1},
//         {'name': 'Ônibus', 'value': 3},
//         {'name': 'Patinete', 'value': 4}
//     ];
//     plotTreemap(data, '#transport-viz', 'Qual o meio de transporte da vítima?');

});

var loadCircumstancesStats = function() {
    $.ajax({
        url: '/statistics/circumstances/period',
        success: function(data) {
            plotTreemap(data, '#period-viz', 'Quando o incidente ocorreu?');
        }
    });

    $.ajax({
        url: '/statistics/circumstances/objectstaken',
        success: function(data) {
            plotTreemap(data, '#objects-taken-viz', 'Quais os objectos mais levados pelos assaltantes?');
        }
    });

    $.ajax({
        url: '/statistics/circumstances/transport',
        success: function(data) {
            plotTreemap(data, '#transport-viz', 'Qual o meio de transporte da vítima?');
        }
    });
};
