from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.enums import DLSScenarioEnum


class SecondInningsDelayedErrorTests(APITestCase):

    def setUp(self):
        self.url = reverse("api:calculate_dls_score")
        self.base_payload = {
            "scenario_type": DLSScenarioEnum.SECOND_INNINGS_DELAYED.value,
            "match_format": "T20",
            "inputs": {
                "oversAvailableToTeam1AtStart": 20.0,
                "runsScoredByTeam1": 180,
                "oversAvailableToTeam2AtStart": 15.0
            }
        }

    def test_missing_required_fields(self):
        """
        Ensure 400 Bad Request when a required field is missing.
        Field 'runs_scored_by_team_1' is removed.
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        del payload['inputs']['runsScoredByTeam1']

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
        payload['inputs']['runsScoredByTeam1'] = "a_string"

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('runs_scored_by_team_1', response.data['inputs'])
        self.assertEqual(response.data['inputs']['runs_scored_by_team_1'][0], "Must be a number.")

    def test_validation_team2_overs_vs_team1_overs(self):
        """
        Error if Team 2 overs > Team 1 overs.
        Rule: overs_available_to_team_2_at_start <= overs_available_to_team_1_at_start
        """
        payload = self.base_payload.copy()
        payload['inputs'] = self.base_payload['inputs'].copy()
        payload['inputs']['oversAvailableToTeam2AtStart'] = 21.0

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('inputs', response.data)
        self.assertIn('overs_available_to_team_2_at_start', response.data['inputs'])
        
        # Note: The validator uses snake_case, but the response keys might depend on DRF settings or serializer.
        # However, looking at the previous error tests, the error key returned is the input key.
        # The message comes from the validator which uses the field map to format the nice name.
        
        expected_msg = "Must be lesser than or equal to oversAvailableToTeam1AtStart"
        # Accessing the error for 'oversAvailableToTeam2AtStart'
        self.assertIn(expected_msg, response.data['inputs']['overs_available_to_team_2_at_start'])
