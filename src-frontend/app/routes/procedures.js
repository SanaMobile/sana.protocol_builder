import Application from 'src-frontend/routes/application';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Application.extend(AuthenticatedRouteMixin, {
});
