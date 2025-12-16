from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch
from api.enums import DLSScenarioEnum


class CommonAPITests(APITestCase):

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
                "wickets_lost_by_team_1_during_curtailed": 2,
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

    @patch('api.views.DLSService.calculate')
    def test_calculate_dls_score_generic_exception(self, mock_calculate):
        """
        Ensure API returns a 400 error on a generic, unexpected exception during calculation.
        """
        error_message = "An unexpected error occurred"
        mock_calculate.side_effect = Exception(error_message)

        url = reverse("api:calculate_dls_score")
        data = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": {
                "overs_available_to_team_1_at_start": 20.0,
                "runs_scored_by_team_1": 150,
                "wickets_lost_by_team_1_during_curtailed": 2,
                "overs_used_by_team_1_during_curtailed": 15.0,
                "overs_available_to_team_2_at_start": 15.0
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"status": "error", "message": error_message})
