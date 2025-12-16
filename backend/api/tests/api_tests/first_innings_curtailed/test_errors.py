from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class FirstInningsCurtailedErrorTests(APITestCase):
    
    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.base_payload = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": {
                "overs_available_to_team_1_at_start": 20.0,
                "runs_scored_by_team_1": 150,
                "wickets_lost_by_team_1_during_curtailed": 2,
                "overs_used_by_team_1_during_curtailed": 15.0,
                "overs_available_to_team_2_at_start": 18.0
            }
        }

    def test_missing_required_fields(self):
        """
        Ensure 400 Bad Request when a required field is missing.
        Field 'overs_available_to_team_1_at_start' is removed.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        del payload['inputs']['overs_available_to_team_1_at_start']

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_available_to_team_1_at_start', response.data['inputs'])

    def test_invalid_data_types(self):
        """
        Ensure 400 Bad Request when non-numeric strings are passed.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['runs_scored_by_team_1'] = "invalid_number"

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('runs_scored_by_team_1', response.data['inputs'])
        self.assertEqual(response.data['inputs']['runs_scored_by_team_1'][0], "Must be a number.")

    def test_validation_team2_overs_vs_team1_start_overs(self):
        """
        Error if Team 2 overs >= Team 1 start overs.
        Rule: overs_available_to_team_2_at_start < overs_available_to_team_1_at_start
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['overs_available_to_team_2_at_start'] = 20.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_available_to_team_2_at_start', response.data['inputs'])
        # Logical check: T2_start (20) >= T1_start (20) is invalid.
        # However, T2_start (20) > T1_used (15) is ALSO invalid (and stricter).
        # The validator overwrites the error key, so we see the "Used" error msg.
        expected_msg = "Must be lesser than oversUsedByTeam1DuringCurtailed"
        self.assertIn(expected_msg, response.data['inputs']['overs_available_to_team_2_at_start'])

    def test_validation_team1_used_overs_vs_team1_start_overs(self):
        """
        Error if Team 1 used overs >= Team 1 start overs.
        Rule: overs_used_by_team_1_during_curtailed < overs_available_to_team_1_at_start
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['overs_used_by_team_1_during_curtailed'] = 20.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_used_by_team_1_during_curtailed', response.data['inputs'])
        expected_msg = "Must be lesser than oversAvailableToTeam1AtStart"
        self.assertIn(expected_msg, response.data['inputs']['overs_used_by_team_1_during_curtailed'])

    def test_validation_team2_overs_vs_team1_used_overs(self):
        """
        Error if Team 2 overs > Team 1 used overs.
        Rule: overs_available_to_team_2_at_start < overs_used_by_team_1_during_curtailed
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['overs_used_by_team_1_during_curtailed'] = 15.0
        payload['inputs']['overs_available_to_team_2_at_start'] = 16.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_available_to_team_2_at_start', response.data['inputs'])
        expected_msg = "Must be lesser than oversUsedByTeam1DuringCurtailed"
        self.assertIn(expected_msg, response.data['inputs']['overs_available_to_team_2_at_start'])
