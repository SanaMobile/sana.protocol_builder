from fabric.api import *  # noqa
from fabric.colors import *  # noqa

env.colorize_errors = True
env.hosts = ['sanaprotocolbuilder.me']
env.user = 'root'
env.virtualenv = 'source /usr/local/bin/virtualenvwrapper.sh'
env.project_root = '/opt/sana.protocol_builder'


def test():
    local('python src-backend/manage.py syncdb --noinput')
    local('python src-backend/manage.py test api --noinput')


def lint():
    local('flake8 src-backend')
    local('./tools/flow check')


def verify():
    lint()
    test()


def update_host():
    with cd(env.project_root), prefix(env.virtualenv), prefix('workon sana_protocol_builder'):
        print(green('Pulling latest revision...'))
        run('git pull origin master')

        print(green('Installing python dependencies...'))
        run('pip install -qr requirements.txt')

        print(green('Installing node dependencies...'))
        run('npm install')

        print(green('Running grunt...'))
        run('grunt')

        print(green('Creating database tables...'))
        run('python src-backend/manage.py syncdb --noinput')

        print(green('Importing fixtures...'))
        run('python src-backend/manage.py loaddata src-backend/fixtures/pages.json')

        print(green('Collecting static files...'))
        run('python src-backend/manage.py collectstatic --noinput')

        print(green('Restarting gunicorn...'))
        run('supervisorctl restart gunicorn')


def travis_deploy():
    update_host()


def local_deploy():
    local('git push origin master')
    update_host()
