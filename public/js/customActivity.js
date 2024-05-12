define(function (require) {
  var Postmonger = require('postmonger');
  var $ = require('jquery');
  var connection = new Postmonger.Session();
  var payload = {};
  var eventDefinitionKey;
  var schema;
 

  
  $(window).ready(function () {
      connection.trigger('ready');
      connection.trigger('requestInteraction');
  });

  connection.on('initActivity', function (data) {
      if (data && data['arguments'] && data['arguments'].execute.inArguments.length > 0) {
          payload = data;
      }

  });

  connection.on('requestedInteraction', function (settings) {
      eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
      connection.trigger('requestSchema');
  });

  connection.on('requestedSchema', function (data) {
      schema = data.schema;
      var columns = schema.map(function (column) {
          return column.key.split('.').pop();
      });
      $('#ToColumn').empty();
      $('#variableDropdown').empty();
      $('#variableDropdownTitle').empty();
      $('#variableDropdownMessage').empty();

      

      columns.forEach(function (column) {
          $('#ToColumn').append(new Option(column, column));
          $('#variableDropdown').append(new Option(column, column));
          $('#variableDropdownTitle').append(new Option(column, column));
          $('#variableDropdownMessage').append(new Option(column, column));

      });
  });

  connection.on('clickedNext', function () {
      
          save();
     
  });

  connection.on('clickedBack', function () {
      connection.trigger('prevStep');
     
  });

  


  function save() {
      var ToColumn = $('#ToColumn').val();
      var TitleColumn = $('#TitleColumn').val();
      var MessageColumn = $('#MessageColumn').val();
      var idlink1 = $('#ButtonLink').val();
      var idnome1 = $('#ButtonText').val();
     
      var schemaMap = {};

      schema.forEach(function (column) {
          var columnName = column.key.split('.').pop();    
          var columnValue = '{{Event.' + eventDefinitionKey + '.' + columnName + '}}';    
          schemaMap[columnName] = columnValue;    
      });
  
      // Replace all placeholders in the message
      for (var key in schemaMap) {
          if (schemaMap.hasOwnProperty(key)) {
              MessageColumn = MessageColumn.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
              TitleColumn = TitleColumn.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
          }
      }
 
      var inArguments = [];

      inArguments.push({ "ToColumn": schemaMap[ToColumn] });
      inArguments.push({ "TitleColumn": TitleColumn });
      inArguments.push({ "MessageColumn": MessageColumn });
      inArguments.push({ "idlink1": idlink1 });
      inArguments.push({ "idnome1": idnome1 });
      

      // Atualiza o payload
      payload['arguments'] = payload['arguments'] || {};
      payload['arguments'].execute = payload['arguments'].execute || {};
      payload['arguments'].execute.inArguments = inArguments;
      payload['metaData'] = payload['metaData'] || {};
      payload['metaData'].isConfigured = true;

      // Transforma o payload em JSON
      var jsonPayload = JSON.stringify(payload);

      // Exibe o payload no console
      console.log('Payload:', jsonPayload);

      // Atualiza a atividade com o payload
      connection.trigger('updateActivity', payload);
  }

});
