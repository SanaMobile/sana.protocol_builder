// var CreateSuite = require('utils/create_suite');
// var Storage = require('utils/storage');
// var SessionModel = require('models/session');

// const TOKEN = 'fake_token';


// CreateSuite("Session Model", function() {
//     var session;
//     var storage;

//     beforeEach(function() {
//         storage = new Storage();
//         session = new SessionModel({
//             storage: storage
//         });
//     });

//     afterEach(function() {
//         session.clear();
//     });

//     describe("Model default behaviour", function() {
//         var storage_mock;

//         beforeEach(function() {
//             storage_mock = sinon.mock(session.storage);
//         });

//         afterEach(function() {
//             storage_mock.verify();
//         });

//         describe("#url()", function() {
//             it("should throw an error", function() {
//                 assert.throw(session.url);
//             });
//         });

//         describe("#fetch()", function() {
//             it("should read from storage", function() {
//                 storage_mock.expects('read').once();
//                 session.fetch();
//             });
//             it("should trigger change event", function() {
//                 var storage_stub = sinon.stub(session.storage, 'read', function() {
//                     var data = {};
//                     data[SessionModel.AUTH_TOKEN_KEY] = TOKEN;
//                     return data;
//                 });

//                 var event_spy = sinon.spy();
//                 session.on('change:' + SessionModel.AUTH_TOKEN_KEY, event_spy);
//                 session.fetch();
//                 assert(event_spy.calledOnce);
//             });
//         });

//         describe("#save()", function() {
//             it("should write to storage", function() {
//                 storage_mock.expects('write').once();
//                 session.save();
//             });
//         });

//         describe("#destroy()", function() {
//             it("should delete from storage", function() {
//                 storage_mock.expects('delete').once();
//                 session.destroy();
//             });
//             it("should trigger change event", function() {
//                 var event_spy = sinon.spy();
//                 session.set(SessionModel.AUTH_TOKEN_KEY, TOKEN);
//                 session.on('change:' + SessionModel.AUTH_TOKEN_KEY, event_spy);
//                 session.destroy();
//                 assert(event_spy.calledOnce);
//             });
//             it("should not have any data left afterwards", function() {
//                 session.set('test_key', 'test_data');
//                 session.destroy();
//                 assert.isFalse(session.has('test_key'));
//             });
//         });

//         describe("#validate()", function() {
//             // validate() returns nothing if it was successful
//             // otherwise returns something to represent the error

//             it("should fail if there is no token", function() {
//                 session.unset(SessionModel.AUTH_TOKEN_KEY);
//                 assert.isDefined(session.validate());
//             });
//             it("should succeed if there is a token", function() {
//                 session.set(SessionModel.AUTH_TOKEN_KEY, TOKEN);
//                 assert.isUndefined(session.validate());
//             });
//         });
//     });

//     describe("Authentication Methods", function() {
//         var server;

//         beforeEach(function() {
//             server = sinon.fakeServer.create();
//         });

//         afterEach(function() {
//             server.restore();
//         });

//         describe("#signup()", function() {
//             it("should send an AJAX request", function(){
//                 session.signup();
//                 assert.lengthOf(server.requests, 1);
//             });

//             it("should call _auth_handler on success", function(){
//                 server.respondWith([200, {}, '']);

//                 var auth_handler_spy = sinon.spy(session, '_auth_handler');
//                 session.signup();
//                 server.respond();

//                 assert(auth_handler_spy.calledOnce);
//             });

//             it("should call network_error_handler on error", function(){
//                 server.respondWith([404, {}, '']);

//                 var server_error_handler = sinon.spy();
//                 var network_error_handler = sinon.spy();
//                 session.signup(null, server_error_handler, network_error_handler);
//                 server.respond();

//                 assert(server_error_handler.notCalled);
//                 assert(network_error_handler.calledOnce);
//             });
//         });

//         describe("#login()", function() {
//             it("should send an AJAX request", function(){
//                 session.login();
//                 assert.lengthOf(server.requests, 1);
//             });

//             it("should call _auth_handler on success", function(){
//                 server.respondWith([200, {}, '']);

//                 var auth_handler_spy = sinon.spy(session, '_auth_handler');
//                 session.login();
//                 server.respond();

//                 assert(auth_handler_spy.calledOnce);
//             });

//             it("should call network_error_handler on error", function(){
//                 server.respondWith([404, {}, '']);

//                 var server_error_handler = sinon.spy();
//                 var network_error_handler = sinon.spy();
//                 session.login(null, server_error_handler, network_error_handler);
//                 server.respond();

//                 assert(server_error_handler.notCalled);
//                 assert(network_error_handler.calledOnce);
//             });
//         });

//         describe("#logout()", function() {
//             it("should send an AJAX request", function(){
//                 session.logout();
//                 assert.lengthOf(server.requests, 1);
//             });

//             it("should not call destroy() immediately", function(){
//                 var destroy_spy = sinon.spy(session, 'destroy');
//                 session.logout();
//                 assert(destroy_spy.notCalled);
//             });

//             it("should call destroy() after server returns success", function(){
//                 var destroy_spy = sinon.spy(session, 'destroy');

//                 session.logout();
//                 server.respondWith([200, {}, '']);
//                 server.respond();

//                 assert(destroy_spy.calledOnce);
//             });

//             it("should call destroy() after server returns error", function(){
//                 var destroy_spy = sinon.spy(session, 'destroy');

//                 session.logout();
//                 server.respondWith([401, {}, '']);
//                 server.respond();

//                 assert(destroy_spy.calledOnce);
//             });
//         });
//     });

//     describe("#constructor()", function() {
//         it("should have a storage engine", function() {
//             assert.isObject(session.storage);
//             assert.strictEqual(session.storage, storage);
//         });
//     });

//     describe("#_auth_handler()", function() {
//         it("should save token if request was successful on the backend", function() {
//             var save_spy = sinon.spy(session, 'save');
//             var server_error_handler = sinon.spy();
//             var response = {
//                 success: true,
//                 token: TOKEN,
//             };

//             session._auth_handler(response, server_error_handler);

//             assert.strictEqual(session.get(SessionModel.AUTH_TOKEN_KEY), TOKEN);
//             assert(save_spy.calledOnce);
//             assert(server_error_handler.notCalled);
//         });

//         it("should call server_error_handler if request was unsuccessful on the backend", function() {
//             const ERROR_MESSAGE = 'error';

//             var save_spy = sinon.spy(session, 'save');
//             var server_error_handler = sinon.spy();
//             var response = {
//                 success: false,
//                 token: TOKEN,
//                 errors: ERROR_MESSAGE,
//             };

//             session._auth_handler(response, server_error_handler);

//             assert.isUndefined(session.get(SessionModel.AUTH_TOKEN_KEY));
//             assert(save_spy.notCalled);
//             assert(server_error_handler.calledOnce);
//             assert(server_error_handler.calledWith(ERROR_MESSAGE));
//         });
//     });

//     describe("#_check_token()", function() {
//         it("should send an AJAX request", function(){
//             // TODO
//         });
//     });

// });
