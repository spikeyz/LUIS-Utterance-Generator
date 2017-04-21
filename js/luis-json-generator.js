function luisJSONGenerator(inputData, entities, version)
{
  var keys = Object.keys(inputData);
  var utterances = {};

  keys.forEach(function(key) {
    let json = {};
    json[key.toString()] = inputData[key];

    var values = intentUtteranceGenerator(json).split('\n')
    var utteranceClean = values.map(function(utt){
      return utt.replace(key.toString(), '').trim()
    });

    utterances[key.toString()] = utteranceClean;
  })

  var LUISBody = [];

  //LUIS GENERATOR
  keys.forEach(function(key){

    utterances[key.toString()].forEach(function(utt){
      var block = {};
      var newLine = utt;
      var entityLabels = [];

      entities.forEach((value, key) => {
        newLine = newLine.replace(key.toString(), value.toString());

        if(utt.indexOf(key) > -1){
          entityLabel = {};

          switch(version){
            case "1" :
              entityLabel["entity"] = key.toString().substring(1, key.toString().length - 1);
              entityLabel["startPos"] = utt.indexOf(key.toString());
              entityLabel["endPos"] = entityLabel["startPos"] + value.length - 1;
            break;
            case "2" :
            entityLabel["entityName"] = key.toString().substring(1, key.toString().length - 1);
            entityLabel["startCharIndex"] = utt.indexOf(key.toString());
            entityLabel["endCharIndex"] = entityLabel["startCharIndex"] + value.length - 1;
            break;
          }
          entityLabels.push(entityLabel);
        }
      })

      console.log(entityLabels)

      switch(version){
        case "1" :
          block["intent"] = key.toString();
          block["entities"] = entityLabels;
        break;
        case "2" :
          block["intentName"] = key.toString();
          block["entityLabels"] = entityLabels;
        break;
      }

      block["text"] = newLine;

      if(newLine != "")
        LUISBody.push(block);
    })
  })

  return LUISBody;
}
