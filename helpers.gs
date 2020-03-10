// Insert
function insertHTMLAction(e) {
  var html = e.formInput.html;
  var response = CardService.newUpdateDraftActionResponseBuilder()
    .setUpdateDraftBodyAction(CardService.newUpdateDraftBodyAction()
    .addUpdateContent(
      html,
      CardService.ContentType.MUTABLE_HTML)
      .setUpdateType(
        CardService.UpdateDraftBodyType.IN_PLACE_INSERT))
        .build();
  return response;
}

// GET FROM DRIVE
function getTemplates () {
  var folder = DriveApp.getFoldersByName("emailTemplates").next();
  var templateFiles = folder.getFilesByType(MimeType.HTML);
  var templateList = [];
  
  while (templateFiles.hasNext()) {
    var template = templateFiles.next();
    var content = template.getBlob();
    templateList.push( {"name": content.getName(), "content": content.getDataAsString()} );
  }
  return templateList;
}

// SAVE TO DRIVE
function saveNewTemplate(e) {
  var html = e.formInput.html;
  var templateName = e.formInput.templateName;
  var folder = DriveApp.getFoldersByName("emailTemplates").next();
  
  if(folder.getFilesByName(templateName).hasNext()) {
    return notify('"' + templateName + '" already exsits. Try another name.');
  }else{ 
    createDoc(templateName, html);
    notify(e.parameters.name + "saved.");
  }
  
  
  var response = buildBaseCard(e);
  return response;
}

function updateExistingTemplate(e) {
  var html = e.formInput.html;
  var templateName = e.parameters.name;
  var folder = DriveApp.getFoldersByName("emailTemplates").next();
  var doc = folder.getFilesByName(templateName).next();
  
  doc.setContent(html);
  
  var response = buildBaseCard(e);
  return response;
}

// DELETE DOC

function deleteTemplate(e) {
  var folder = DriveApp.getFoldersByName("emailTemplates").next();
  var doc = folder.getFilesByName(e.parameters.name).next();
  doc.setTrashed(true);
  return buildBaseCard(e);
}

// CREATE DRIVE HTML DOC
function createDoc (name, html) {
  var folder = DriveApp.getFoldersByName("emailTemplates").next();
  var newDoc = folder.createFile(name, html, MimeType.HTML);
}


// UTILS
function cleanHTML(html) {
  return HtmlService.createHtmlOutput().appendUntrusted(html);
}

function notify(message){
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification()
    .setText(message))
    .build();
}

