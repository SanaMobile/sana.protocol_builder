from fabric.api import *  # noqa
from fabric.colors import *  # noqa

env.colorize_errors = True
env.hosts = ['sanaprotocolbuilder.me']
env.user = 'root'
env.virtualenv = 'source /usr/local/bin/virtualenvwrapper.sh'
env.project_root = '/opt/sana.protocol_builder'
env.frontend_root = '/opt/sana.protocol_builder/src-frontend'


def test():
    local('python src-backend/manage.py syncdb --noinput')
    local('python src-backend/manage.py test api --noinput')
    local('python src-backend/manage.py test registration --noinput')

    with lcd('src-backbone'):
        local('npm test')


def lint():
    local('flake8 src-backend')


def verify():
    lint()
    test()


def runserver():
    local('python src-backend/manage.py syncdb --noinput')
    local('python src-backend/manage.py runserver')


def update_host():
    with cd(env.project_root), prefix(env.virtualenv), prefix('workon sana_protocol_builder'):
        print(green('Pulling latest revision...'))
        run('git checkout master')
        run('git reset --hard HEAD')
        run('git pull origin master')
        run('git clean -fd')

        print(green('Installing python dependencies...'))
        run('pip install -qr requirements.txt')

        print(green('Creating database tables...'))
        run('python src-backend/manage.py syncdb --noinput')

        print(green('Restarting gunicorn...'))
        run('supervisorctl restart gunicorn')

    with cd(env.frontend_root):
        print(green('Building Ember application...'))
        run('npm install')
        run('bower install --allow-root')
        run('ember build --environment production')


def travis_deploy():
    update_host()


def local_deploy():
    local('git push origin master')
    update_host()
