from django.test import SimpleTestCase
from api.services import DLSService
from rest_framework.exceptions import ValidationError

class CommonServiceTests(SimpleTestCase):
    
    def setUp(self):
        self.service = DLSService()

    def test_invalid_scenario_type_raises_validation_error(self):
        """
        Test that providing an unknown scenario type raises a ValidationError.
        This covers the 'if not calculator_method:' check in DLSService.calculate.
        """
        invalid_data = {
            "scenario_type": "UNKNOWN_SCENARIO",
            "match_format": "T20",
            "inputs": {}
        }
        
        with self.assertRaises(ValidationError) as cm:
            self.service.calculate(invalid_data)
            
        error_dict = cm.exception.detail
        self.assertIn("scenario_type", error_dict)
        # Using simple string check since ValidationError detail structure can vary
        self.assertTrue("Invalid scenario: UNKNOWN_SCENARIO" in str(error_dict["scenario_type"]))
