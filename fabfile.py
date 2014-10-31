from fabric.api import *
from fabric.colors import *

env.colorize_errors = True
env.hosts           = ['sanaprotocolbuilder.me']
env.user            = 'root'
env.project_root    = '/opt/sana.protocol_builder'

def prepare_deploy():
    local('python sana_builder/manage.py syncdb')
    local('python sana_builder/manage.py test')
    local('git push')

def deploy():
    with cd(env.project_root), prefix('workon sana_protocol_builder'):
        print(green('Pulling latest revision...'))
        run('git pull')

        print(green('Installing dependencies...'))
        run('pip install -qr requirements.txt')

        print(green('Migrating database...'))
        run('python sana_builder/manage.py syncdb')

        print(green('Restarting gunicorn...'))
        run('supervisorctl restart gunicorn')
