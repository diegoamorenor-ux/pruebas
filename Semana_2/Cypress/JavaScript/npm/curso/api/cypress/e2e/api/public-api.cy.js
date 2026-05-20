describe('Public API examples', () => {
  it('should fetch one post by id', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts/1').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('title');
    });
  });

  it('should create a post', () => {
    cy.request('POST', 'https://jsonplaceholder.typicode.com/posts', {
      title: 'curso-api',
      body: 'sample body',
      userId: 10
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.include({
        title: 'curso-api',
        userId: 10
      });
    });
  });
});
