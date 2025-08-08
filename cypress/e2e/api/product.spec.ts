import { Product, ProductAPI, ProductCategory } from '../../support/api';

const isSortedAsc = (arr: string[]): boolean => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1].localeCompare(arr[i]) > 0) {
      return false;
    }
  }
  return true;
};

const isSortedDesc = (arr: string[]): boolean => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1].localeCompare(arr[i]) < 0) {
      return false;
    }
  }
  return true;
};

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

  // 9) FORMAT test
  it('GET /products?limit&skip - format: envelope stays consistent', () => {
    ProductAPI.list({ limit: 7, skip: 7 }).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.limit).to.equal(7);
      expect(res.body.skip).to.equal(7);
      expect(res.body.products).to.have.length(7);
    });
  });

  // 10) BEHAVIOR test
  it('GET /products?limit&skip - behavior: respects skip', () => {
    // get first product
    ProductAPI.list({ limit: 1 }).then((res) => {
      const firstProductId = res.body.products[0].id;
      // get second product with skip
      ProductAPI.list({ limit: 1, skip: 1 }).then((res2) => {
        const secondProductId = res2.body.products[0].id;
        // second product should not be the same as first
        expect(secondProductId).to.not.equal(firstProductId);
      });
    });
  });

  // 11) BEHAVIOR test
  it('GET /products?limit=0 - behavior: returns all items', () => {
    ProductAPI.list({ limit: 0 }).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.products.length).to.equal(res.body.total);
    });
  });

  // 12) BEHAVIOR test
  it('GET /products?limit=9999 - behavior: respects max limit', () => {
    const limit = 9999; // Assumption: limit 9999 is greater than total products
    ProductAPI.list({ limit }).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.products.length).to.equal(res.body.total);
    });
  });

  // 13) BEHAVIOR test
  it('GET /products?skip=9999 - behavior: returns empty array if skip is greater than total', () => {
    const skip = 9999; // Assumption: skip 9999 is greater than total products
    ProductAPI.list({ skip }).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.products).to.be.an('array').and.to.be.empty;
      expect(res.body.skip).to.equal(skip);
      expect(res.body.total).to.be.lessThan(skip);
    });
  });

  // 14) BEHAVIOR test
  /* IMPORTANT: This test is deliberately failing to highlight a bug in the API's sorting functionality.
     The API is returning an unsorted list, despite the `sortBy` and `order` parameters. */
  it('GET /products?sortBy=title&order=asc - behavior: returns sorted titles in ascending order', () => {
    // Assumption: the API supports ascending sorting by title
    ProductAPI.list({ limit: 30, sortBy: 'title', order: 'asc' }).then((res) => {
      const titles = res.body.products.map((p: Product) => p.title);
      expect(isSortedAsc(titles)).to.equal(true);
    });
  });

  // 15) BEHAVIOR test
  /* IMPORTANT: This test is deliberately failing to highlight a bug in the API's sorting functionality.
     The API is returning an unsorted list, despite the `sortBy` and `order` parameters. */
  it('GET /products?sortBy=title&order=desc - behavior: returns sorted titles in descending order', () => {
    // Assumption: the API supports descending sorting by title
    ProductAPI.list({ limit: 30, sortBy: 'title', order: 'desc' }).then((res) => {
      const titles = res.body.products.map((p: Product) => p.title);
      expect(isSortedDesc(titles)).to.equal(true);
    });
  });

  // 16) FORMAT test
  it('GET /products/categories - format: array of categories', () => {
    ProductAPI.listCategories()
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').and.not.be.empty;

        res.body.forEach((c: ProductCategory) => {
          expect(c).to.have.all.keys('slug', 'name', 'url');
          expect(c.slug).to.be.a('string');
          expect(c.name).to.be.a('string');
          expect(c.url).to.be.a('string');
        });
      });
  });

});
