from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .enums import DLSScenarioEnum

class DLSScoreViewTests(APITestCase):
    
    def test_calculate_dls_score_first_innings_curtailed_success(self):
        """
        Ensure we can get a par score for the FirstInningsCurtailed scenario.
        """
        url = reverse("api:calculate_dls_score")
        data = {
            "dls_scenario": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "overs_available_to_team_1_at_start": 20.0,
            "runs_scored_by_team_1": 150,
            "wickets_lost_by_team_1": 2,
            "overs_used_by_team_1_during_curtailed": 15.0,
            "overs_available_to_team_2_at_start": 18.0
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('par_score', response.data['data'])
        # The expected par score is calculated based on the DLS logic.
        # This value may need to be adjusted if the DLS resource table or logic changes.
        self.assertEqual(response.data['data']['par_score'], 169)

    def test_calculate_dls_score_missing_fields(self):
        """
        Ensure API returns a 400 error if required fields for a scenario are missing.
        """
        url = reverse("api:calculate_dls_score")
        data = {
            "dls_scenario": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "runs_scored_by_team_1": 150,
            "wickets_lost_by_team_1": 2,
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("overs_available_to_team_1_at_start", response.data)

    def test_calculate_dls_score_invalid_scenario(self):
        """
        Ensure API returns a 400 error for an invalid dls_scenario.
        """
        url = reverse("api:calculate_dls_score")
        data = {
            "dls_scenario": "InvalidScenario",
            "runs_scored_by_team_1": 150,
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("dls_scenario", response.data)