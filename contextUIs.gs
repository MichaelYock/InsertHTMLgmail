function getComposeUI(e) {
  return [buildBaseCard(e)];
}

function getHomepageUI(e) {
  return [buildBaseCard(e)];
}

function getContextualUI(){
  var card = CardService.newCardBuilder();
  var cardSection = CardService.newCardSection().setHeader('Welcome!');
  
  cardSection.addWidget(
    CardService.newTextParagraph()
    .setText("This Add-on uses the compose window, please compose a new email"));
  
  return card.addSection(cardSection).build();
}
