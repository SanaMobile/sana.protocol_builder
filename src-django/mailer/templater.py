from jinja2 import Environment, PackageLoader


def get_environment(application, template_dir):
    return Environment(loader=PackageLoader(application, template_dir))
