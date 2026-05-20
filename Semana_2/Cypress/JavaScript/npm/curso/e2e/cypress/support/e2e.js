require('@testing-library/cypress/add-commands');

Cypress.Commands.add('findByXpath', (xpath) => {
	return cy.document().then((doc) => {
		const node = doc.evaluate(
			xpath,
			doc,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;

		expect(node, `XPath not found: ${xpath}`).to.not.be.null;
		return cy.wrap(node);
	});
});
