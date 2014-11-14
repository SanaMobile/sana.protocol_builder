from django.test import TestCase
from webapp.models import Element, ChoiceElement, SingleValueElement, Choice

class ElementTest(TestCase):
    def setUp(self):
        Element.objects.create()

    def test_elements_are_initialized(self):
        elems = Element.objects.all()
        self.assertEquals(len(elems), 1)

        elem = elems[0]
        self.assertEquals(elem.eid, '')
        self.assertEquals(elem.concept, '')
        self.assertEquals(elem.question, '')
        self.assertEquals(elem.default_answer, '')
