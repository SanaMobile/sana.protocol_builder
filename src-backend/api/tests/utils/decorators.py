from api.startup import grant_permissions


# Use this decorator to add permissions to a new user
# created in your setUp method for tests.
def initialize_permissions(self):
    def _grant_permissions():
        grant_permissions()

    return _grant_permissions
