from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class FirstInningsCurtailedSuccessTests(APITestCase):

    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.valid_payload = {
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

    def test_calculate_dls_score_basic_success(self):
        """
        Verify that a valid payload returns a 200 OK and expected DLS results.
        Input: Team 1 scores 150/2 in 15 overs (curtailed), Team 2 has 15 overs.
        """
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertIn('revised_target', response.data)
        self.assertIn('messages', response.data)

        # We check structure primarily; exact values depend on the DLS table
        self.assertIsInstance(response.data['par_score'], int)
        self.assertIsInstance(response.data['revised_target'], int)
        self.assertEqual(response.data['par_score'], 169)
        self.assertEqual(response.data['revised_target'], 170)

    def test_calculate_dls_score_with_string_inputs(self):
        """
        Verify that string inputs in the payload are correctly converted to numbers.
        """
        string_payload = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": {
                "overs_available_to_team_1_at_start": "20.0",
                "runs_scored_by_team_1": "150",
                "wickets_lost_by_team_1_during_curtailed": "2",
                "overs_used_by_team_1_during_curtailed": "15.0",
                "overs_available_to_team_2_at_start": "15.0"
            }
        }

        response = self.client.post(self.url, string_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)

    def test_boundary_conditions_zero_runs(self):
        """
        Test with 0 runs scored.
        """
        payload = self.valid_payload.copy()
        payload['inputs']['runs_scored_by_team_1'] = 0

        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('revised_target', response.data)

    def test_boundary_conditions_max_wickets(self):
        """
        Test with 9 wickets lost (almost all out). 
        10 wickets might imply innings completed, not curtailed, depending on logic.
        """
        payload = self.valid_payload.copy()
        payload['inputs']['wickets_lost_by_team_1_during_curtailed'] = 9

        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_calculate_dls_score_odi_success(self):
        """
        Verify that a valid ODI payload returns a 200 OK and expected DLS results.
        Input: Team 1 scores 250/4 in 40 overs (curtailed from 50), Team 2 has 40 overs.
        """
        odi_payload = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "match_format": "ODI",
            "inputs": {
                "overs_available_to_team_1_at_start": 50.0,
                "runs_scored_by_team_1": 250,
                "wickets_lost_by_team_1_during_curtailed": 4,
                "overs_used_by_team_1_during_curtailed": 40.0,
                "overs_available_to_team_2_at_start": 40.0
            }
        }
        response = self.client.post(self.url, odi_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertIn('revised_target', response.data)
        self.assertIn('messages', response.data)

        self.assertIsInstance(response.data['par_score'], int)
        self.assertIsInstance(response.data['revised_target'], int)
