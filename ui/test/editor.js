describe('Editor test', function() {
  before(browser => browser.navigateTo('OXTED'));

  it('OXTED test', function(browser) {
    browser.waitForElementVisible('body');
    browser.element.find('button.rounded')
      .getText().assert.equals('Datei auswählen');
  });

  after(browser => browser.end());
});
