from unittest import TestCase

class ExampleTest(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_that_always_passes(self):
        val1 = 10
        val2 = 10
        val3 = 'foo'

        self.assertEqual(val1, val2)
        self.assertNotEqual(val1, val3)

