from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class SecondInningsCurtailedErrorTests(APITestCase):

    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.base_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": {
                "overs_available_to_team_1_at_start": 20.0,
                "runs_scored_by_team_1": 180,
                "overs_available_to_team_2_at_start": 20.0,
                "overs_used_by_team_2_during_curtailed": 10.0,
                "wickets_lost_by_team_2_during_curtailed": 3
            }
        }

    def test_missing_required_fields(self):
        """
        Ensure 400 Bad Request when a required field is missing.
        Field 'runs_scored_by_team_1' is removed.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        del payload['inputs']['runs_scored_by_team_1']

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('runs_scored_by_team_1', response.data['inputs'])

    def test_invalid_data_types(self):
        """
        Ensure 400 Bad Request when non-numeric strings are passed.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['runs_scored_by_team_1'] = "a_string"

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('runs_scored_by_team_1', response.data['inputs'])
        self.assertEqual(response.data['inputs']['runs_scored_by_team_1'][0], "Must be a number.")

    def test_validation_team2_used_overs_vs_team2_start_overs(self):
        """
        Error if Team 2 used overs >= Team 2 start overs.
        Rule: overs_used_by_team_2_during_curtailed < overs_available_to_team_2_at_start
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['overs_used_by_team_2_during_curtailed'] = 21.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_used_by_team_2_during_curtailed', response.data['inputs'])
        expected_msg = "Must be lesser than oversAvailableToTeam2AtStart"
        self.assertIn(expected_msg, response.data['inputs']['overs_used_by_team_2_during_curtailed'])

    def test_validation_team2_start_overs_vs_team1_start_overs(self):
        """
        Error if Team 2 start overs > Team 1 start overs.
        Rule: overs_available_to_team_2_at_start <= overs_available_to_team_1_at_start
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['overs_available_to_team_2_at_start'] = 21.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_available_to_team_2_at_start', response.data['inputs'])
        expected_msg = "Must be lesser than or equal to oversAvailableToTeam1AtStart"
        self.assertIn(expected_msg, response.data['inputs']['overs_available_to_team_2_at_start'])
