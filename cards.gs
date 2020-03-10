var nameInput = CardService.newTextInput()
      .setFieldName("templateName")
      .setTitle("Template Name")
      .setMultiline(false);
  
var htmlInput = CardService.newTextInput()
      .setFieldName("html")
      .setMultiline(true)
      .setValue("**<br><br>// Add HTML here<br><br>** ");
  
var insertButton = CardService.newTextButton()
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setText("Insert into Email")
      .setOnClickAction(CardService.newAction()
      .setFunctionName('insertHTMLAction'));

var createButton = CardService.newTextButton()
     .setText("Create Template")
     .setOnClickAction(CardService.newAction()
     .setFunctionName('buildTemplateCard')
     .setParameters({}));

var deleteButton = CardService.newTextButton()
     .setText("Delete");

function listButton (template) {
  return CardService.newTextButton()
          .setText(template.name)
          .setOnClickAction(CardService.newAction()
          .setFunctionName('buildTemplateCard')
          .setParameters(template));
}

function list (userTemplates) {
  var listSection = CardService.newCardSection();
  for (var template of userTemplates){
    listSection.addWidget(listButton(template));
  }
  return listSection;
}

function saveButton(newTemplate, name) {
  var button = CardService.newTextButton()
     .setText("Save Template");

  if (newTemplate) {
    button
     .setOnClickAction(CardService.newAction()
     .setFunctionName('saveNewTemplate'));
  }else{
    button
     .setOnClickAction(CardService.newAction()
     .setFunctionName('updateExistingTemplate')
                       .setParameters({"name": name}));
  }
  return button;
}


/** BASE CARD **/
function buildBaseCard(e) {
  var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle('Add HTML'));
  var editorSection = CardService.newCardSection();
  var userTemplates = getTemplates();
  
  editorSection
    .addWidget(htmlInput)
    .addWidget(
      CardService.newButtonSet()
      .addButton(insertButton)
      .addButton(createButton));
  
  card.addSection(editorSection);
  
  if(userTemplates[0]){
    var listSection = list(userTemplates);
    card.addSection(listSection)
  }

  return card.build();
}


/** TEMPLATE **/
function buildTemplateCard(e) {
  var card = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle("Edit Template"));
  var editorSection = CardService.newCardSection();
  var newTemplate = !("name" in e.parameters);
  var name;

  if (newTemplate){
    name = "New Template";
    var content = cleanHTML(e.formInput.html).getContent() || "";
    editorSection
      .addWidget(
        nameInput
         .setValue(name));
    
  }else{
   name = e.parameters.name;
   var content = cleanHTML(e.parameters.content).getContent();
    
    editorSection
      .addWidget(
        CardService.newTextParagraph()
          .setText("<h2>" + name + "</h2>"))
  }
  
  editorSection
    .addWidget(
      htmlInput
       .setValue(content))
    .addWidget(
    CardService.newButtonSet()
      .addButton(insertButton)
      .addButton(saveButton(newTemplate, name)));
  
  if (!newTemplate) {
    editorSection.addWidget(deleteButton
                            .setOnClickAction(CardService.newAction()
                            .setFunctionName('deleteTemplate')
                            .setParameters({"name": name})));
  }

  
    return card.addSection(editorSection).build();
}
