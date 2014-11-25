from sana_test_case import SanaTestCase
from webapp.models import Element, ChoiceElement, SingleValueElement, Choice

class ElementTest(SanaTestCase):
    def setUp(self):
        pass
        #Element.objects.create(element_order=0, page=super(self).test_page)

    # def test_elements_are_initialized(self):
    #     elems = Element.objects.all()
    #     self.assertEquals(len(elems), 1)

    #     elem = elems[0]
    #     self.assertEquals(elem.eid, '')
    #     self.assertEquals(elem.concept, '')
    #     self.assertEquals(elem.question, '')
    #     self.assertEquals(elem.default_answer, '')
