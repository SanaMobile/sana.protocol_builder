from sana_test_case import SanaTestCase
from webapp.models import Procedure

class ProcedureTest(SanaTestCase):
    def test_procedures_are_initialized(self):
        proc = Procedure.objects.get(author='tester')
        self.assertEquals(proc.author, 'tester')
        self.assertEquals(proc.title, 'test procedure')
        self.assertEquals(proc.version, '')

    def test_str(self):
        proc = Procedure.objects.get(author='tester')
        expected = '<Procedure title="test procedure" author="tester" version="">\n</Procedure>'
        self.assertEquals(str(proc), expected)
