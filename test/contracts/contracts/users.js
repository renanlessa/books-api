import jwt from 'jwt-simple';

describe('Routes Books', () => {
  const Users = app.datasource.models.Users;
  const jwtSecret = app.config.jwtSecret;

  const defaultBook = {
    id: 1,
    name: 'Default book',
    description: 'Default description',
  };

  const user = {
    name: 'user',
    email: 'user@mail.com',
    password: '12345pin',
  };

  let token;

  beforeEach((done) => {
    Users.destroy({ where: {} })
      .then(() => Users.create(user))
      .then((user) => {
        Books.destroy({ where: {} })
          .then(() => Books.create(defaultBook))
          .then(() => {
            token = jwt.encode({ id: user.id }, jwtSecret);
            done();
          });
      });
  });

  describe('Route GET /books', () => {
    it('should return a list of books', (done) => {
      const booksList = Joi.array().items(Joi.object().keys({
        id: Joi.number(),
        name: Joi.string(),
        description: Joi.string(),
        created_at: Joi.date().iso(),
        updated_at: Joi.date().iso(),
      }));

      request.get('/books')
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          joiAssert(res.body, booksList);

          done(err);
        });
    });
  });

  describe('Route GET /books/{id}', () => {
    it('should return a book', (done) => {
      const book = Joi.object().keys({
        id: Joi.number(),
        name: Joi.string(),
        description: Joi.string(),
        created_at: Joi.date().iso(),
        updated_at: Joi.date().iso(),
      });

      request.get('/books/1')
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          joiAssert(res.body, book);

          done(err);
        });
    });
  });

  describe('Route POST /books', () => {
    it('should create a book', (done) => {
      const newBook = {
        id: 2,
        name: 'newBook',
        description: 'newDescription',
      };

      const book = Joi.object().keys({
        id: Joi.number(),
        name: Joi.string(),
        description: Joi.string(),
        created_at: Joi.date().iso(),
        updated_at: Joi.date().iso(),
      });

      request.post('/books')
        .set('Authorization', `JWT ${token}`)
        .send(newBook).end((err, res) => {
          joiAssert(res.body, book);

          done(err);
        });
    });
  });

  describe('Route PUT /books/{id}', () => {
    it('should update a book', (done) => {
      const updatedBook = {
        id: 1,
        name: 'updatedBook',
        description: 'updateDescription',
      };

      const updatedCount = Joi.array().items([1]);

      request.put('/books/1')
        .set('Authorization', `JWT ${token}`)
        .send(updatedBook).end((err, res) => {
          joiAssert(res.body, updatedCount);

          done(err);
        });
    });
  });

  describe('Route DELETE /books/{id}', () => {
    it('should delete a book', (done) => {
      request.delete('/books/1')
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.eql(204);

          done(err);
        });
    });
  });
});
