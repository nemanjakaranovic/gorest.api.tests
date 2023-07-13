import { faker } from '@faker-js/faker';
import request from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const url = 'https://gorest.co.in/public/v2/users';
const bearerToken = process.env.BEARER_TOKEN;

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
        done();
      });
  });

  it('updates user details', function (done) {
    let updatedName = faker.person.firstName() + ' ' + faker.person.lastName();
    request(`${url}`)
      .patch(`/${createdUserId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .send({ name: updatedName })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.name).to.equal(updatedName);
        done();
      });
  });

  it('updates user object', function (done) {
    let updatedUser = {
      name: faker.person.firstName() + ' ' + faker.person.lastName(),
      email: faker.internet.email(),
      gender: 'female',
      status: 'inactive'
    };
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
