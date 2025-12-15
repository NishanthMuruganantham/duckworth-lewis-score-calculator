from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .enums import DLSScenarioEnum

class DLSScoreViewTests(APITestCase):
    
    def test_calculate_dls_score_with_string_inputs(self):
        """
        Ensure API handles string inputs by converting them to numbers.
        """
        url = reverse("api:calculate_dls_score")
        data = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": {
                "overs_available_to_team_1_at_start": "20.0",
                "runs_scored_by_team_1": "150",
                "wickets_lost_by_team_1_during_curtailed": "2",
                "overs_used_by_team_1_during_curtailed": "15.0",
                "overs_available_to_team_2_at_start": "18.0"
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return same result as the integer test (194/195)
        self.assertEqual(response.data['par_score'], 194)
        self.assertEqual(response.data['revised_target'], 195)
    def test_calculate_dls_score_first_innings_curtailed_success(self):
        """
        Ensure we can get a par score for the FirstInningsCurtailed scenario.
        """
        url = reverse("api:calculate_dls_score")
        data = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,  # "first_innings_curtailed"
            "match_format": "T20",
            "inputs": {
                "overs_available_to_team_1_at_start": 20.0,
                "runs_scored_by_team_1": 150,
                "wickets_lost_by_team_1_during_curtailed": 2,
                "overs_used_by_team_1_during_curtailed": 15.0,
                "overs_available_to_team_2_at_start": 18.0
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check standardized response fields
        self.assertIn('par_score', response.data)
        self.assertIn('revised_target', response.data)
        self.assertIn('messages', response.data)
        
        self.assertEqual(response.data['par_score'], 194)
        self.assertEqual(response.data['revised_target'], 195)

    def test_calculate_dls_score_missing_fields(self):
        """
        Ensure API returns a 400 error if required fields for a scenario are missing in inputs.
        """
        url = reverse("api:calculate_dls_score")
        data = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": {
                "runs_scored_by_team_1": 150,
                "wickets_lost_by_team_1_during_curtailed": 2,
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Error should be nested in inputs
        self.assertIn("inputs", response.data)
        self.assertIn("overs_available_to_team_1_at_start", response.data["inputs"])

    def test_calculate_dls_score_invalid_scenario(self):
        """
        Ensure API returns a 400 error for an invalid scenario_type.
        """
        url = reverse("api:calculate_dls_score")
        data = {
            "scenario_type": "InvalidScenario",
            "match_format": "T20",
            "inputs": {
                "runs_scored_by_team_1": 150,
            }
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("scenario_type", response.data)

    def test_get_resource_table(self):
        """
        Ensure we can retrieve the resource table.
        """
        url = reverse("api:resource_table")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("columns", response.data)
        self.assertIn("data", response.data)