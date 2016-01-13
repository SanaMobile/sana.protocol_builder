from fabric.api import *  # noqa
from fabric.colors import *  # noqa

env.colorize_errors = True
env.hosts           = ['sanaprotocolbuilder.me']
env.user            = 'root'
env.virtualenv      = 'source /usr/local/bin/virtualenvwrapper.sh'
env.project_root    = '/opt/sana.protocol_builder/'
env.backend_dir     = 'src-django'
env.frontend_dir    = 'src-backbone'


def test():
    with lcd(env.backend_dir):
        local('python manage.py syncdb --noinput')
        local('python manage.py test api --noinput')
        local('python manage.py test authentication --noinput')

    with lcd(env.frontend_dir):
        local('npm test')


def lint():
    with lcd(env.backend_dir):
        local('flake8')


def verify():
    lint()
    test()


def update_host():
    with cd(env.project_root), prefix(env.virtualenv), prefix('workon sana_protocol_builder'):
        print(green('Pulling latest revision...'))
        run('git checkout master')
        run('git reset --hard HEAD')
        run('git pull origin master')
        run('git clean -fd')

        with cd(env.project_root + env.backend_dir):
            print(green('Installing python dependencies...'))
            run('pip install --quiet --requirement requirements.txt')

            print(green('Creating database tables...'))
            run('python manage.py syncdb --noinput')

            print(green('Restarting gunicorn...'))
            run('supervisorctl restart gunicorn')

        with cd(env.project_root + env.frontend_dir):
            print(green('Building Backbone application...'))
            run('npm install')
            run('gulp build')


def travis_deploy():
    update_host()


def local_deploy():
    local('git push origin master')
    update_host()
