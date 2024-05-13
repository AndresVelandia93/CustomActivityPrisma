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
      $('#SelectContacto').empty();

      columns.forEach(function (column) {
          $('#SelectContacto').append(new Option(column, column));
      });
  });

  connection.on('clickedNext', function () {
        save();
  });

  connection.on('clickedBack', function () {
      connection.trigger('prevStep');
     
  });

  function save() {
      var ContactID = $('#SelectContacto').val();
     
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

      inArguments.push({ "ContactId": schemaMap[ContactID] });
      inArguments.push({ "IdCampana": IdCampana });
      inArguments.push({ "CallToAction": CallToAction });
      inArguments.push({ "TimeToLive": TimeToLive });
      inArguments.push({ "Categoria": Categoria });
      inArguments.push({ "Title": Title });
      inArguments.push({ "ShortDescription": ShortDescription });
      inArguments.push({ "LongDescription": LongDescription });
      inArguments.push({ "CallToActionLabel": CallToActionLabel });
      inArguments.push({ "SecondaryCallToAction": SecondaryCallToAction });
      inArguments.push({ "Nombre": Nombre });
      inArguments.push({ "Modulo": Modulo });
      

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
