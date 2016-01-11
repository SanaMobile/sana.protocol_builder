require('setup/hooks');

describe("Auth Form Behavior", function () {
    let authFormBehavior;

    beforeEach(function() {
        let AuthFormBehavior = proxyquire('behaviors/authFormBehavior', {
            'utils/helpers': {},
        });
        authFormBehavior = new AuthFormBehavior();
        authFormBehavior.options = {
            onAuthenticate: function() { },
        };
    });

    describe("#_auth()", function() {
        it("calls onAuthenticate", function() {
            let optionsOnAuthenticateStub = sinon.stub(authFormBehavior.options, 'onAuthenticate');
            let event = {
                preventDefault: function() { },
            };

            let formSerializeArraySpy = sinon.spy();
            authFormBehavior.ui.form = {
                serializeArray: formSerializeArraySpy,
            };

            authFormBehavior._auth(event);

            assert(optionsOnAuthenticateStub.calledOnce);
            assert(formSerializeArraySpy.calledOnce);
        });
    });

});
