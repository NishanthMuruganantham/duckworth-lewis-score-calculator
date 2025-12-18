from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class SecondInningsInterruptedErrorTests(APITestCase):

    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.base_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_INTERRUPTED.value,
            "match_format": "T20",
            "inputs": {
                "oversAvailableToTeam1AtStart": 20.0,
                "runsScoredByTeam1": 230,
                "oversAvailableToTeam2AtStart": 20.0,
                "oversUsedByTeam2DuringInterruption": 5.0,
                "wicketsLostByTeam2DuringInterruption": 4,
                "revisedOversToTeam2AfterResumption": 7.0
            }
        }

    def test_missing_required_field(self):
        """
        Ensure 400 Bad Request when a required field is missing.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        del payload['inputs']['runsScoredByTeam1']

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('runs_scored_by_team_1', response.data['inputs'])

    def test_invalid_data_type(self):
        """
        Ensure 400 Bad Request when data type is wrong.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['runsScoredByTeam1'] = "invalid"

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('runs_scored_by_team_1', response.data['inputs'])

    def test_overs_used_greater_than_overs_start(self):
        """
        Team 2 used overs must be less than their starting overs.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['oversUsedByTeam2DuringInterruption'] = 21.0
        payload['inputs']['revisedOversToTeam2AfterResumption'] = 22.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_used_by_team_2_during_interruption', response.data['inputs'])
        self.assertIn(
            'Must be lesser than oversAvailableToTeam2AtStart',
            response.data['inputs']['overs_used_by_team_2_during_interruption']
        )

    def test_revised_overs_greater_than_start_overs(self):
        """
        Team 2 revised overs must be less than their starting overs.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['revisedOversToTeam2AfterResumption'] = 21.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('revised_overs_to_team_2_after_resumption', response.data['inputs'])
        self.assertIn(
            'Must be lesser than oversAvailableToTeam2AtStart',
            response.data['inputs']['revised_overs_to_team_2_after_resumption']
        )

    def test_revised_overs_less_than_used_overs(self):
        """
        Team 2 revised overs must be greater than the overs already used.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['revisedOversToTeam2AfterResumption'] = 4.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_used_by_team_2_during_interruption', response.data['inputs'])
        self.assertIn(
            'Must be lesser than revisedOversToTeam2AfterResumption',
            response.data['inputs']['overs_used_by_team_2_during_interruption']
        )

    def test_team2_start_overs_greater_than_team1_start_overs(self):
        """
        Team 2's starting overs cannot exceed Team 1's starting overs.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['oversAvailableToTeam2AtStart'] = 21.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_available_to_team_2_at_start', response.data['inputs'])
        self.assertIn(
            'Must be lesser than or equal to oversAvailableToTeam1AtStart',
            response.data['inputs']['overs_available_to_team_2_at_start']
        )
