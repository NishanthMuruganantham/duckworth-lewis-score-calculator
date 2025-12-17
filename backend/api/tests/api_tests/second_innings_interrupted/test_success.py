from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class SecondInningsInterruptedSuccessTests(APITestCase):

    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.valid_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_INTERRUPTED.value,
            "match_format": "T20",
            "inputs": {
                "overs_available_to_team_1_at_start": 20.0,
                "runs_scored_by_team_1": 230,
                "overs_available_to_team_2_at_start": 20.0,
                "overs_used_by_team_2_during_interruption": 5.0,
                "wickets_lost_by_team_2_during_interruption": 4,
                "revised_overs_to_team_2_after_resumption": 7
            }
        }

    def test_calculate_dls_score_basic_success(self):
        """
        Verify that a valid payload returns a 200 OK and expected DLS results.
        """
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertIn('revised_target', response.data)
        self.assertIn('messages', response.data)

        self.assertIsInstance(response.data['par_score'], int)
        self.assertIsInstance(response.data['revised_target'], int)
        self.assertEqual(response.data['par_score'], 106)
        self.assertEqual(response.data['revised_target'], 107)

    def test_calculate_dls_score_with_string_inputs(self):
        """
        Verify that string inputs in the payload are correctly converted to numbers.
        """
        string_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_INTERRUPTED.value,
            "match_format": "T20",
            "inputs": {
                "oversAvailableToTeam1AtStart": "20.0",
                "runsScoredByTeam1": "230",
                "oversAvailableToTeam2AtStart": "20.0",
                "oversUsedByTeam2DuringInterruption": "5.0",
                "wicketsLostByTeam2DuringInterruption": "4",
                "revisedOversToTeam2AfterResumption": "7"
            }
        }

        response = self.client.post(self.url, string_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)

    def test_boundary_conditions_zero_runs(self):
        """
        Test with 0 runs scored before interruption.
        """
        payload = self.valid_payload.copy()
        payload['inputs']['runsScoredByTeam1'] = 0

        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('revised_target', response.data)

    def test_boundary_conditions_max_wickets(self):
        """
        Test with 9 wickets lost before interruption.
        """
        payload = self.valid_payload.copy()
        payload['inputs']['wicketsLostByTeam2DuringInterruption'] = 9

        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_calculate_dls_score_odi_success(self):
        """
        Verify that a valid ODI payload returns a 200 OK and expected DLS results.
        """
        odi_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_INTERRUPTED.value,
            "match_format": "ODI",
            "inputs": {
                "oversAvailableToTeam1AtStart": 50.0,
                "runsScoredByTeam1": 300,
                "oversAvailableToTeam2AtStart": 50.0,
                "oversUsedByTeam2DuringInterruption": 10.0,
                "wicketsLostByTeam2DuringInterruption": 1,
                "revisedOversToTeam2AfterResumption": 40.0
            }
        }
        response = self.client.post(self.url, odi_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertIn('revised_target', response.data)
        self.assertIsInstance(response.data['par_score'], int)
        self.assertIsInstance(response.data['revised_target'], int)
