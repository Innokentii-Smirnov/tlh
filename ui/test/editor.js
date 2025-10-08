describe('Editor test', function() {
  before(browser => browser.navigateTo('OXTED'));

  it('OXTED test', function(browser) {
    browser.waitForElementVisible('body');
    const chooseFileButton = browser.element.find('button.rounded');
    chooseFileButton.getText().assert.equals('Datei auswählen');
    chooseFileButton.click();
    const filepath = require('path').resolve(__dirname + '/KBo 32.14.xml');
    browser.uploadFile('input[type="file"]', filepath);
    browser.waitForElementVisible('.flex');
    const word = browser.element.findAllByText('na-a-li').nth(1);
    word.assert.visible();
    word.click();
    browser.waitForElementVisible('input[type="text"]');
    const stemField = browser.element.find('input[type="text"]');
    stemField.assert.visible();
    const glossField = browser.element.findAll('input[type="text"]').nth(1);
    glossField.assert.visible();
    glossField.sendKeys('Rehbock');
    const analysisSelectionButton = browser.element.find(by.xpath("//button[text()='.ABS']"));
    analysisSelectionButton.assert.visible();
    analysisSelectionButton.click();
    const updateButton = browser.element.find(by.xpath("//button[text()='Aktualisieren']"));
    updateButton.assert.visible();
    updateButton.click();
    //const endButton = browser.element.find(by.xpath("//button[text()='✕']"));
    //endButton.assert.visible();
    //endButton.click();
    const dictButton = browser.element.findByText('Wörterbuch');
    dictButton.assert.visible();
    dictButton.click();
    browser.element.find('input[value="nāli"]').assert.visible();
    const unfoldButton = browser.element.findByText('∨');
    unfoldButton.assert.visible();
    unfoldButton.click();
    const unfoldButton2 = browser.element.findAllByText('∨').nth(1);
    unfoldButton2.assert.visible();
    unfoldButton2.click();
    browser.element.findByText('KBo 32.14').assert.visible();
    browser.element.findByText('Vs. 9a').assert.visible();
    browser.pause();
  });

  //after(browser => browser.end());
});
