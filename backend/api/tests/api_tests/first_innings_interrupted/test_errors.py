from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class FirstInningsInterruptedErrorTests(APITestCase):

    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.base_payload = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_INTERRUPTED.value,
            "match_format": "ODI",
            "inputs": {
                "overs_available_to_team_1_at_start": 50.0,
                "overs_used_by_team_1_during_interruption": 20.0,
                "wickets_lost_by_team_1_during_interruption": 2,
                "revised_overs_to_team_1_after_resumption": 45.0,
                "runs_scored_by_team_1": 250,
                "overs_available_to_team_2_at_start": 40.0
            }
        }

    def test_missing_required_fields(self):
        """
        Ensure 400 when a field is missing.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        del payload['inputs']['revised_overs_to_team_1_after_resumption']

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('revised_overs_to_team_1_after_resumption', response.data['inputs'])

    def test_start_overs_vs_used_overs(self):
        """
        Start overs must be > Used overs.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['overs_used_by_team_1_during_interruption'] = 50.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('overs_available_to_team_1_at_start', response.data['inputs'])
        self.assertIn(
            'Must be greater than oversUsedByTeam1DuringInterruption', 
            response.data['inputs']['overs_available_to_team_1_at_start']
        )

    def test_start_overs_vs_resumption_overs(self):
        """
        Start overs must be > Resumption overs (since it was interrupted).
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['revised_overs_to_team_1_after_resumption'] = 50.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('revised_overs_to_team_1_after_resumption', response.data['inputs'])
        self.assertIn(
            'Must be lesser than oversAvailableToTeam1AtStart', 
            response.data['inputs']['revised_overs_to_team_1_after_resumption']
        )

    def test_resumption_overs_vs_team2_start(self):
        """
        Resumption overs (T1 total) must be greater than or equal to T2 start overs.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['overs_available_to_team_2_at_start'] = 46.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('overs_available_to_team_2_at_start', response.data['inputs'])
        self.assertIn(
            'Must be lesser than or equal to revisedOversToTeam1AfterResumption', 
            response.data['inputs']['overs_available_to_team_2_at_start']
        )
