from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class FirstInningsInterruptedSuccessTests(APITestCase):

    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.valid_payload = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_INTERRUPTED.value,
            "match_format": "T20",
            "inputs": {
                "oversAvailableToTeam1AtStart": 20.0,
                "oversUsedByTeam1DuringInterruption": 10.0,
                "wicketsLostByTeam1DuringInterruption": 2,
                "oversAvailableToTeam1AtResumption": 18.0,
                "runsScoredByTeam1": 150,
                "oversAvailableToTeam2AtStart": 15.0
            }
        }

    def test_calculate_dls_score_interrupted_success(self):
        """
        Verify that a valid payload returns a 200 OK.
        Input: 20 overs start, interrupted at 10, resumes with 18 total for T1, T2 gets 15.
        """
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertIn('revised_target', response.data)
        self.assertEqual(response.data['par_score'], 118)
        self.assertEqual(response.data['revised_target'], 119)


    def test_string_inputs_conversion(self):
        """
        Verify that string inputs work correctly.
        """
        payload = self.valid_payload.copy()
        payload['inputs']['overs_available_to_team_1_at_start'] = "20.0"
        payload['inputs']['runs_scored_by_team_1'] = "150"

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('par_score', response.data)
        self.assertEqual(response.data['par_score'], 118)
        self.assertEqual(response.data['revised_target'], 119)
