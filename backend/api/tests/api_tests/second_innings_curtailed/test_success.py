from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class SecondInningsCurtailedSuccessTests(APITestCase):

    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.valid_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": {
                "oversAvailableToTeam1AtStart": 20.0,
                "runsScoredByTeam1": 180,
                "oversAvailableToTeam2AtStart": 20.0,
                "oversUsedByTeam2DuringCurtailed": 10.0,
                "wicketsLostByTeam2DuringCurtailed": 2
            }
        }

    def test_calculate_par_score_basic_success(self):
        """
        Verify that a valid payload returns a 200 OK and expected DLS par score.
        Input: Team 1 scores 180 in 20 overs. Team 2's innings is curtailed at 10 overs, having lost 2 wickets.
        """
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertIn('messages', response.data)
        self.assertIsInstance(response.data['par_score'], int)
        self.assertEqual(response.data['par_score'], 82)

    def test_calculate_par_score_with_string_inputs(self):
        """
        Verify that string inputs in the payload are correctly converted to numbers.
        """
        string_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": {
                "oversAvailableToTeam1AtStart": "20.0",
                "runsScoredByTeam1": "180",
                "oversAvailableToTeam2AtStart": "20.0",
                "oversUsedByTeam2DuringCurtailed": "10.0",
                "wicketsLostByTeam2DuringCurtailed": "2"
            }
        }

        response = self.client.post(self.url, string_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertEqual(response.data['par_score'], 82)

    def test_boundary_conditions_zero_runs_team1(self):
        """
        Test with Team 1 scoring 0 runs. The par score should also be 0.
        """
        payload = self.valid_payload.copy()
        payload['inputs']['runsScoredByTeam1'] = 0

        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertEqual(response.data['par_score'], 0)

    def test_boundary_conditions_max_wickets_team2(self):
        """
        Test with 9 wickets lost by Team 2 (almost all out).
        """
        payload = self.valid_payload.copy()
        payload['inputs']['wicketsLostByTeam2DuringCurtailed'] = 9

        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertTrue(response.data['par_score'] > 0)

    def test_calculate_par_score_odi_success(self):
        """
        Verify a valid ODI payload returns a 200 OK and expected par score.
        Input: Team 1 scores 280 in 50 overs. Team 2 is 150/3 after 30 overs when play stops.
        """
        odi_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value,
            "match_format": "ODI",
            "inputs": {
                "oversAvailableToTeam1AtStart": 50.0,
                "runsScoredByTeam1": 280,
                "oversAvailableToTeam2AtStart": 50.0,
                "oversUsedByTeam2DuringCurtailed": 30.0,
                "wicketsLostByTeam2DuringCurtailed": 3
            }
        }
        response = self.client.post(self.url, odi_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertIsInstance(response.data['par_score'], int)
        self.assertEqual(response.data['par_score'], 143)

    def test_calculate_par_score_t10_success(self):
        """
        Verify a valid T10 payload returns a 200 OK and expected par score.
        Input: Team 1 scores 95 in 10 overs. Team 2 is 50/1 after 5 overs when play stops.
        """
        t10_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value,
            "match_format": "T10",
            "inputs": {
                "oversAvailableToTeam1AtStart": 10.0,
                "runsScoredByTeam1": 95,
                "oversAvailableToTeam2AtStart": 10.0,
                "oversUsedByTeam2DuringCurtailed": 5.0,
                "wicketsLostByTeam2DuringCurtailed": 1
            }
        }
        response = self.client.post(self.url, t10_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertIn('messages', response.data)
        self.assertIsInstance(response.data['par_score'], int)
        self.assertEqual(response.data['par_score'], 42)
