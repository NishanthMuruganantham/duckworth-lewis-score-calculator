from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


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
