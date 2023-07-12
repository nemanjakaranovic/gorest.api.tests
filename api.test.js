import { faker } from '@faker-js/faker';
import request from 'supertest';
import { expect } from 'chai';

const url = 'https://gorest.co.in/public/v2/users';
const bearerToken = '3676d5cd7be8d018e27cd2f11295edbcd9fbaed66ee9caed2bbe23d0be29ac5f';

let createdUserId;

describe('gorest API tests', function () {
  this.timeout('60000');

  it('creates new user', function (done) {
    let user = {
      name: faker.person.firstName() + ' ' + faker.person.lastName(),
      email: faker.internet.email(),
      gender: 'male',
      status: 'active'
    };
    //console.log(user);
    request(`${url}`)
      .post('/')
      .set('Authorization', `Bearer ${bearerToken}`)
      .send(user)
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.a('number');
        expect(res.body.name).to.equal(user.name);
        expect(res.body.email).to.equal(user.email);
        expect(res.body.gender).to.equal(user.gender);
        expect(res.body.status).to.equal(user.status);
        createdUserId = res.body.id;
        //console.log(createdUserId);
        done();
      });
  });

  it('gets the created user', function (done) {
    request(`${url}`)
      .get(`/${createdUserId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(createdUserId);
        //console.log(res.body);
        done();
      });
  });

  it('updates user details', function (done) {
    let updatedName = faker.person.firstName() + ' ' + faker.person.lastName();
    //console.log(`updatedName: ${updatedName}`);
    request(`${url}`)
      .patch(`/${createdUserId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .send({ name: updatedName })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.name).to.equal(updatedName);
        //console.log(res.body);
        done();
      });
  });

  it('updates user object', function (done) {
    //let updatedName = faker.person.firstName() + ' ' + faker.person.lastName();
    //console.log(`updatedName: ${updatedName}`);
    let updatedUser = {
      name: faker.person.firstName() + ' ' + faker.person.lastName(),
      email: faker.internet.email(),
      gender: 'female',
      status: 'inactive'
    };
    //console.log(updatedUser);
    request(`${url}`)
      .put(`/${createdUserId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .send(updatedUser)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.name).to.equal(updatedUser.name);
        expect(res.body.email).to.equal(updatedUser.email);
        expect(res.body.gender).to.equal(updatedUser.gender);
        expect(res.body.status).to.equal(updatedUser.status);
        //console.log(res.body);
        done();
      });
  });

  it('deletes the user', function (done) {
    request(`${url}`)
      .delete(`/${createdUserId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(204, done);
  });

  it('try to get the deleted user', function (done) {
    request(`${url}`)
      .get(`/${createdUserId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Resource not found');
        done();
      });
  });
});
