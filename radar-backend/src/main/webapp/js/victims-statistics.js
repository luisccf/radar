$(function() {
    loadTemplate();
    // loadVictimsStats();

/* FOR TESTING */

    // Creates gender plot
    var data = [
        {'name': 'Masculino', 'value': 12},
        {'name': 'Feminino', 'value': 15},
        {'name': 'Outro', 'value': 3}  
    ];
    plotTreemap(data, '#gender-viz', 'Ocorrências por gênero da vítima');

    // Creates color plot 
    var data = [
        {'name': 'Branca', 'value': 10},
        {'name': 'Azul', 'value': 15},
        {'name': 'Parda', 'value': 3},
        {'name': 'Preta', 'value': 3}, 
        {'name': 'Amarela', 'value': 5}  
    ];
    plotTreemap(data, '#color-viz', 'Ocorrências por cor da vítima');

    // Creates age plot
    var data = [
        {'name': '13 a 24', 'value': 10},
        {'name': '25 a 36', 'value': 20},
        {'name': '37 a 48', 'value': 3},
        {'name': '49 a 60', 'value': 0}, 
        {'name': '61 a 72', 'value': 1},
        {'name': 'maior que 72', 'value': 1}  
    ];
    plotBarChart(data, '#age-viz', 'Ocorrências por idade da vítima', 'Idade', 'Quantidade');

    // Creates height plot 
    var data = [
        {'name': 'Menos de 1,50 metros', 'value': 2},
        {'name': 'Entre 1,50 e 1,60 metros', 'value': 20},
        {'name': 'Entre 1,60 e 1,70 metros', 'value': 12},
        {'name': 'Entre 1,70 e 1,80 metros', 'value': 9}, 
        {'name': 'Mais de 1,80 metros', 'value': 1}  
    ];
    plotBarChart(data, '#height-viz', 'Ocorrências por altura da vítima', 'Altura', 'Quantidade');

    // Creates police report plot 
    var data = [
        {'name': 'Sim', 'value': 10},
        {'name': 'Não', 'value': 29}
    ];
    plotPieChart(data, '#police-report-viz', 'Vítima fez boletim de ocorrências?');

    // Creates alone/not alone plot 
    var data = [
        {'name': 'Sim', 'value': 30},
        {'name': 'Não', 'value': 20}
    ];
    plotPieChart(data, '#alone-viz', 'Vítima estava sozinha?');

});

var loadVictimsStats = function() {
    $.ajax({
        url: '/statistics/victims/gender',
        success: function(data) {
            plotTreemap(data, '#gender-viz', 'Ocorrências por gênero da vítima');
        }
    });

    $.ajax({
        url: '/statistics/victims/color',
        success: function(data) {
            plotTreemap(data, '#color-viz', 'Ocorrências por cor da vítima');
        }
    });

    $.ajax({
        url: '/statistics/victims/age',
        success: function(data) {
            plotBarChart(data, '#age-viz', 'Ocorrências por idade da vítima');
        }
    });

    $.ajax({
        url: '/statistics/victims/height',
        success: function(data) {
            plotBarChart(data, '#height-viz', 'Ocorrências por altura da vítima');
        }
    });

    $.ajax({
        url: '/statistics/victims/policereport',
        success: function(data) {
            plotPieChart(data, '#police-report-viz', 'Vítima fez boletim de ocorrências?');
        }
    });

    $.ajax({
        url: '/statistics/victims/alone',
        success: function(data) {
            plotPieChart(data, '#alone-viz', 'Vítima estava sozinha?');
        }
    });
};
