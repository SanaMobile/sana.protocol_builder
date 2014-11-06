from fabric.api import *
from fabric.colors import *

env.colorize_errors = True
env.hosts           = ['sanaprotocolbuilder.me']
env.user            = 'root'
env.virtualenv      = 'source /usr/local/bin/virtualenvwrapper.sh'
env.project_root    = '/opt/sana.protocol_builder'

def prepare_deploy():
    local('python sana_builder/manage.py syncdb')
    local('python sana_builder/manage.py test')
    local('git push')

def deploy():
    prepare_deploy()

    with cd(env.project_root), prefix(env.virtualenv), prefix('workon sana_protocol_builder'):
        print(green('Pulling latest revision...'))
        run('git pull')

        print(green('Installing dependencies...'))
        run('pip install -qr requirements.txt')

        print(green('Creating database tables...'))
        run('python sana_builder/manage.py syncdb --noinput')

        print(green('Collecting static files...'))
        run('python sana_builder/manage.py collectstatic --noinput')

        print(green('Restarting gunicorn...'))
        run('supervisorctl restart gunicorn')
