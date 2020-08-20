// import { genSalt, hash } from 'bcryptjs';
// import { expect } from 'chai';
// import {
//   after, before, beforeEach, describe, it,
// } from 'mocha';
// import request from 'supertest';
// import app from '../config/app';
// import { closeDB, connectDB, dropDB } from '../config/db';
// import Member from '../models/Member';

// process.env.NODE_ENV = 'test';

// const authenticatedUser = request.agent(app);
// let memberID;
// let memberToken;

// // const deleteImage = () => {
// //   const listParams = {
// //     Bucket: process.env.AWS_BUCKET_NAME,
// //     Prefix: 'images/',
// //   };

// //   const listedObjects = s3.listObjectsV2(listParams);
// //   console.log(listedObjects.Contents);

// //   if (!listedObjects.Contents) return;

// //   const deleteParams = {
// //     Bucket: process.env.AWS_BUCKET_NAME,
// //     Delete: { Objects: [] },
// //   };

// //   listedObjects.Contents.forEach(({ Key }) => {
// //     deleteParams.Delete.Objects.push({ Key });
// //   });

// //   s3.deleteObjects(deleteParams);
// // };

// const createTempMember = async () => {
//   try {
//     const profileImageData = {
//       profileImage:
//         'https://cougarcs-testing.s3.us-east-2.amazonaws.com/static/users-01.png',
//       profileImageKey: 'static/users-01.png',
//     };

//     const data = {
//       firstName: 'Vyas',
//       lastName: 'R',
//       password: '123456',
//       email: 'vyas@test.com',
//       PSID: '1592440',
//       isOfficer: false,
//       profileImageData,
//     };
//     const salt = await genSalt(10);
//     data.password = await hash(data.password, salt);
//     const member = new Member(data);

//     await member.save();
//     memberID = member.id;
//   } catch (err) {
//     console.log(err);
//   }
// };

// describe('POST /member', () => {
//   before(async (done) => {
//     process.env.NODE_ENV = 'test';
//     dropDB();
//     // deleteImage();
//     connectDB();
//     createTempMember();
//     done();
//   });

//   beforeEach((done) => {
//     process.env.NODE_ENV = 'test';
//     Member.deleteMany({ email: 'test@test.com' }, (err) => {
//       if (err) done(err);
//       done();
//     });
//   });

//   // after(async (done) => {
//   //   dropDB();
//   //   // deleteImage();
//   //   closeDB();
//   //   done();
//   // });

//   it('Creating a new member', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: 'Test',
//         lastName: 'Test',
//         email: 'test@test.com',
//         password: '123456',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body).to.contain.property('token');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Create member: Invalid firstName', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: '',
//         lastName: 'Test',
//         email: 'test@test.com',
//         password: '123456',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.msg[0].msg).to.equal('First Name is required');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Create member: Missing firstName', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         lastName: 'Test',
//         email: 'test@test.com',
//         password: '123456',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.msg[0].msg).to.equal('First Name is required');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Create member: Missing lastName', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: 'Test',
//         email: 'test@test.com',
//         password: '123456',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.msg[0].msg).to.equal('Last Name is required');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Create member: Invalid lastName', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: 'Test',
//         lastName: '',
//         email: 'test@test.com',
//         password: '123456',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.msg[0].msg).to.equal('Last Name is required');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Create member: Missing email', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: 'Test',
//         lastName: 'Test',
//         password: '123456',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.msg[0].msg).to.equal('Email is required');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Create member: Invalid email .com', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: 'Test',
//         lastName: 'Test',
//         password: '123456',
//         email: 'test@test',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.msg[0].msg).to.equal('Email is required');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Create member: Invalid email @', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: 'Test',
//         lastName: 'Test',
//         password: '123456',
//         email: 'testtest.com',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.msg[0].msg).to.equal('Email is required');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Create member: Invalid email @ .com', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: 'Test',
//         lastName: 'Test',
//         password: '123456',
//         email: 'testtest',
//         PSID: '1234567',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.msg[0].msg).to.equal('Email is required');
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   it('Fail, Duplicate member', (done) => {
//     request(app)
//       .post('/api/member')
//       .send({
//         firstName: 'Vyas',
//         lastName: 'R',
//         password: '123456',
//         email: 'vyas@test.com',
//         PSID: '1592440',
//       })
//       .then((res) => {
//         const { body } = res;
//         expect(body.errors[0].msg).to.equal('User already exists');
//         done();
//       })
//       .catch((err) => {
//         done(err);
//         console.log(err);
//       });
//   });

//   it('Fail, Auth User', (done) => {
//     authenticatedUser
//       .post('/api/auth')
//       .send({ email: 'vyas@test.com', password: '12345' })
//       .then((res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body.errors[0].msg).to.equal('Invalid Credentials');
//         memberToken = res.body.token;
//         done();
//       });
//   });

//   it('Auth User', (done) => {
//     authenticatedUser
//       .post('/api/auth')
//       .send({ email: 'vyas@test.com', password: '123456' })
//       .then((res) => {
//         expect(res.statusCode).to.equal(200);
//         expect(res.body).to.contain.property('token');
//         memberToken = res.body.token;
//         done();
//       });
//   });

//   it('Delete, user', (done) => {
//     authenticatedUser
//       .delete(`/api/member/${memberID}`)
//       .set('x-auth-token', `${memberToken}`)
//       .set('x-admin-token', `${process.env.AUTH_ADMIN}`)
//       .then((res) => {
//         expect(res.statusCode).to.equal(200);
//         done();
//       })
//       .catch((err) => {
//         console.log(err);
//         done(err);
//       });
//   });

//   after(async (done) => {
//     dropDB();
//     // deleteImage();
//     closeDB();
//     done();
//   });
// });

// /*
//  PUT REQUEST TESTING MEMBER
// */
// // describe('PUT /member', () => {
// //   before(async (done) => {
// //     process.env.NODE_ENV = 'test';
// //     dropDB();
// //     // deleteImage();
// //     connectDB();
// //     createTempMember();
// //     done();
// //   });

// //   beforeEach((done) => {
// //     process.env.NODE_ENV = 'test';
// //     Member.deleteMany({ email: 'test@test.com' }, (err) => {
// //       if (err) done(err);
// //       done();
// //     });
// //   });


// // it('Auth User', (done) => {
// //   authenticatedUser
// //     .post('/api/auth')
// //     .send({ email: 'vyas@test.com', password: '123456' })
// //     .then((res) => {
// //       expect(res.statusCode).to.equal(200);
// //       expect(res.body).to.contain.property('token');
// //       memberToken = res.body.token;
// //       done();
// //     });
// // });

// // it('Update user info', (done) => {
// //   authenticatedUser
// //     .put(`/api/member/${memberID}`)
// //     .set('x-auth-token', `${memberToken}`)
// //     .field('firstName', 'Vyas')
// //     .field('lastName', 'Test')
// //     .field('email', 'test@gmail.com')
// //     .attach('profileImage', `${join(__dirname, '../assets/', 'download.jpeg')}`)
// //     .then((res) => {
// //       expect(res.statusCode).to.equal(200);
// //       expect(res.body).to.contain.property('_id');

// //       done();
// //     })
// //     .catch((err) => {
// //       console.log(err);
// //       done(err);
// //     });
// // });

// //   it('Fail, Update user info: firstName', (done) => {
// //     authenticatedUser
// //       .put(`/api/member/${memberID}`)
// //       .set('x-auth-token', `${memberToken}`)
// //       .field('lastName', 'test')
// //       .field('email', 'test@gmail.com')
// //       .attach('profileImage', `${join(__dirname, '../assets/', 'CougarCS-1.png')}`)
// //       .then((res) => {
// //         expect(res.statusCode).to.equal(400);
// //         expect(res.body.msg[0].msg).to.equal('First Name is required');

// //         done();
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         done(err);
// //       });
// //   });

// //   it('Fail, Update user info: lastName', (done) => {
// //     authenticatedUser
// //       .put(`/api/member/${memberID}`)
// //       .set('x-auth-token', `${memberToken}`)
// //       .field('firstName', 'Vyas')
// //       .field('email', 'test@gmail.com')
// //       .attach('profileImage', `${join(__dirname, '../assets/', 'placeholder.jpg')}`)
// //       .then((res) => {
// //         expect(res.statusCode).to.equal(400);
// //         expect(res.body.msg[0].msg).to.equal('Last Name is required');

// //         done();
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         done(err);
// //       });
// //   });

// //   it('Fail, Update user info: Email', (done) => {
// //     authenticatedUser
// //       .put(`/api/member/${memberID}`)
// //       .set('x-auth-token', `${memberToken}`)
// //       .field('firstName', 'Vyas')
// //       .field('lastName', 'test')
// //       .attach('profileImage', `${join(__dirname, '../assets/', 'CFG19_Dallas-995.jpg')}`)
// //       .then((res) => {
// //         expect(res.statusCode).to.equal(400);
// //         expect(res.body.msg[0].msg).to.equal('Email is required');

// //         done();
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         done(err);
// //       });
// //   });

// //   it('Fail, Update user info: Image', (done) => {
// //     authenticatedUser
// //       .put(`/api/member/${memberID}`)
// //       .set('x-auth-token', `${memberToken}`)
// //       .field('firstName', 'Vyas')
// //       .field('email', 'test@gmail.com')
// //       .field('lastName', 'Test')
// //       .then((res) => {
// //         expect(res.statusCode).to.equal(400);
// //         expect(res.body.errors[0].msg).to.equal('Error updating');
// //         done();
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         done(err);
// //       });
// //   });
// //   it('Delete, user', (done) => {
// //     authenticatedUser
// //       .delete(`/api/member/${memberID}`)
// //       .set('x-auth-token', `${memberToken}`)
// //       .set('x-admin-token', `${process.env.AUTH_ADMIN}`)
// //       .then((res) => {
// //         expect(res.statusCode).to.equal(200);
// //         done();
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         done(err);
// //       });
// //   });

// //   after(async (done) => {
// //     dropDB();
// //     done();
// //   });
// // });
