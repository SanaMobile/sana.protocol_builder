from fabric.api import *
from fabric.colors import *

env.colorize_errors = True
env.hosts           = ['sanaprotocolbuilder.me']
env.user            = 'root'
env.virtualenv      = 'source /usr/local/bin/virtualenvwrapper.sh'
env.project_root    = '/opt/sana.protocol_builder'

def test():
    local('python sana_builder/manage.py syncdb')
    local('python sana_builder/manage.py test')

def update_host():
    with cd(env.project_root), prefix(env.virtualenv), prefix('workon sana_protocol_builder'):
        print(green('Pulling latest revision...'))
        run('git pull origin master')

        print(green('Installing dependencies...'))
        run('pip install -qr requirements.txt')

        print(green('Creating database tables...'))
        run('python sana_builder/manage.py syncdb --noinput')

        print(green('Importing fixtures...'))
        run('python sana_builder/manage.py loaddata sana_builder/fixtures/pages.json')

        print(green('Collecting static files...'))
        run('python sana_builder/manage.py collectstatic --noinput')

        print(green('Restarting gunicorn...'))
        run('supervisorctl restart gunicorn')

def travis_deploy():
    update_host()

def local_deploy():
    local('git push origin master')
    update_host()
