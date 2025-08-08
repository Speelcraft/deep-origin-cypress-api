import { Product, ProductAPI, ProductListResponse } from '../../support/api';

describe('Product API @api', () => {

  // 1) FORMAT test (contract)
  it('GET /products - format: envelope and core fields', () => {
    ProductAPI.list({ limit: 5 }).then((res) => {
      expect(res.status).to.equal(200);
      // Envelope
      expect(res.body).to.have.keys('products', 'total', 'skip', 'limit');
      expect(res.body.total).to.be.a('number');
      expect(res.body.skip).to.be.a('number');
      expect(res.body.limit).to.be.a('number');
      expect(res.body.products).to.be.an('array');

      // Core on each product (assumption: only core is expected)
      res.body.products.forEach((p: Product) => {
        expect(p).to.include.keys('id', 'title', 'category', 'price');
        expect(p.id).to.be.a('number');
        expect(p.title).to.be.a('string');
        expect(p.category).to.be.a('string');
        expect(p.price).to.be.a('number');
      });
    });
  });

  // 2) BEHAVIOR test
  it('GET /products - behavior: returns 30 products when no limit is specified', () => {
    ProductAPI.list().then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.limit).to.equal(30);
      expect(res.body.products.length).to.equal(30);
    });
  });

  // 3) BEHAVIOR test
  it('GET /products - behavior: respects limit', () => {
    const limit = 10;
    ProductAPI.list({ limit }).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.limit).to.equal(limit);
      expect(res.body.products.length).to.equal(limit);
    });
  });

  // 4) FORMAT test (contract)
  it('GET /products/:id - format: core fields exist', () => {
    const id = 1; // assumption: product with ID 1 is always present
    ProductAPI.getById(id).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.id).to.equal(id);
      expect(res.body).to.include.keys('id', 'title', 'category', 'price');
    });
  });

  // 5) NEGATIVE test
  it('GET /products/:id - returns message for non-existent id', () => {
    const nonExistentId = 99999; // assumption: product with ID 99999 does not exist
    ProductAPI.getById(nonExistentId).then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        message: `Product with id '${nonExistentId}' not found`
      });
    });
  });

  // 6) FORMAT test (contract)
  it('GET /products/search - format: envelope and array of products', () => {
    ProductAPI.search('phone').then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.have.keys('products', 'total', 'skip', 'limit');
      expect(res.body.products).to.be.an('array');
      res.body.products.forEach((p: Product) => {
        expect(p).to.include.keys('id', 'title', 'category', 'price');
      });
    });
  });

  // 7) BEHAVIOR test
  it('GET /products/search - behavior: description tend to include the query (heuristic)', () => {
    const term = 'phone'; // assumption: 'phone' is a common term in product descriptions
    ProductAPI.search(term).then((res) => {
      expect(res.body.products).to.not.be.empty;
      res.body.products.forEach((p: Product) => {
        // Assumption: description tend to include the query
        expect(p.description?.toLowerCase()).to.include(term);
      });
    });
  });

  // 8) NEGATIVE test
  it('GET /products/search - returns an empty array for a non-existent term', () => {
    const nonExistentTerm = 'xyz123abc'; // assumption: this term yields no results
    ProductAPI.search(nonExistentTerm).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.products).to.be.an('array').and.to.be.empty;
      expect(res.body.total).to.equal(0);
      expect(res.body.skip).to.equal(0);
      expect(res.body.limit).to.equal(0);
    });
  });

});
