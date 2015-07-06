from api.startup import grant_permissions


# Use this decorator to add permissions to a new user
# created in your setUp method for tests.
def initialize_permissions(self):
    def __grant_permissions():
        grant_permissions()

    return __grant_permissions
