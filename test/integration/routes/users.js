import jwt from 'jwt-simple';

describe('Routes Users', () => {
  const Users = app.datasource.models.Users;
  const jwtSecret = app.config.jwtSecret;

  const defaultUser = {
    id: 1,
    name: 'Default user',
    email: 'test@email.com',
    password: 'test123',
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
        Users.create(defaultUser).then(() => {
          token = jwt.encode({ id: user.id }, jwtSecret);
          done();
        });
      });
  });

  describe('Route GET /users', () => {
    it('should return a list of users', (done) => {
      request.get('/users')
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          expect(res.body[0].id).to.be.eql(defaultUser.id);
          expect(res.body[0].name).to.be.eql(defaultUser.name);
          expect(res.body[0].email).to.be.eql(defaultUser.email);

          done(err);
        });
    });
  });

  describe('Route GET /users/{id}', () => {
    it('should return a user', (done) => {
      request.get('/users/1')
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(defaultUser.id);
          expect(res.body.name).to.be.eql(defaultUser.name);
          expect(res.body.email).to.be.eql(defaultUser.email);

          done(err);
        });
    });
  });

  describe('Route POST /users', () => {
    it('should create a user', (done) => {
      const newUser = {
        id: 2,
        name: 'new user',
        email: 'newemail@email.com',
        password: 'pass123',
      };

      request.post('/users')
        .set('Authorization', `JWT ${token}`)
        .send(newUser).end((err, res) => {
          expect(res.body.id).to.be.eql(newUser.id);
          expect(res.body.name).to.be.eql(newUser.name);
          expect(res.body.email).to.be.eql(newUser.email);

          done(err);
        });
    });
  });

  describe('Route PUT /users/{id}', () => {
    it('should update a user', (done) => {
      const updatedUser = {
        id: 1,
        name: 'updated user',
        email: 'update@email.com',
      };

      request.put('/users/1')
        .set('Authorization', `JWT ${token}`)
        .send(updatedUser).end((err, res) => {
          expect(res.body).to.be.eql([1]);

          done(err);
        });
    });
  });

  describe('Route DELETE /users/{id}', () => {
    it('should delete a user', (done) => {
      request.delete('/users/1')
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.eql(204);

          done(err);
        });
    });
  });
});
