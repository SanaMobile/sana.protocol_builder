from api.startup import run_once


# Use this decorator to add permissions to a new user
# created in your setUp method for tests.
def add_group_permissions(self):
    def _run_once():
        run_once()

    return _run_once
