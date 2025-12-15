from django.test import SimpleTestCase
from api.serializers import DLSRequestSerializer
from api.validators import ScenarioValidator
from api.enums import DLSScenarioEnum


class FirstInningsCurtailedUnitErrorTests(SimpleTestCase):

    def setUp(self):
        self.base_inputs = {
            "overs_available_to_team_1_at_start": 20.0,
            "runs_scored_by_team_1": 150,
            "wickets_lost_by_team_1_during_curtailed": 2,
            "overs_used_by_team_1_during_curtailed": 15.0,
            "overs_available_to_team_2_at_start": 15.0
        }
        self.base_data = {
            "scenario_type": DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value,
            "match_format": "T20",
            "inputs": self.base_inputs
        }

    def test_serializer_missing_required_field(self):
        """
        Test that DLSRequestSerializer catches missing fields in 'inputs'.
        """
        # Remove a required field
        data = self.base_data.copy()
        inputs = self.base_inputs.copy()
        del inputs['overs_available_to_team_1_at_start']
        data['inputs'] = inputs

        serializer = DLSRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('inputs', serializer.errors)
        self.assertIn('overs_available_to_team_1_at_start', serializer.errors['inputs'])

    def test_serializer_invalid_number_format(self):
        """
        Test that serializer rejects non-numeric strings.
        """
        data = self.base_data.copy()
        inputs = self.base_inputs.copy()
        inputs['runs_scored_by_team_1'] = "not-a-number"
        data['inputs'] = inputs

        serializer = DLSRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('inputs', serializer.errors)
        self.assertIn('runs_scored_by_team_1', serializer.errors['inputs'])

    def test_validator_logic_team2_overs_vs_team1_used(self):
        """
        Test logic: Team 2 overs cannot be greater than Team 1 used overs.
        """
        inputs = self.base_inputs.copy()
        inputs['overs_used_by_team_1_during_curtailed'] = 15.0
        inputs['overs_available_to_team_2_at_start'] = 16.0  # Invalid

        errors = ScenarioValidator.validate_first_innings_curtailed(inputs)
        self.assertIn('overs_available_to_team_2_at_start', errors)
        self.assertEqual(
            errors['overs_available_to_team_2_at_start'][0], 
            "Must be lesser than oversUsedByTeam1DuringCurtailed"
        )

    def test_validator_logic_team1_used_vs_start(self):
        """
        Test logic: Team 1 used overs cannot be >= Team 1 start overs.
        """
        inputs = self.base_inputs.copy()
        inputs['overs_available_to_team_1_at_start'] = 20.0
        inputs['overs_used_by_team_1_during_curtailed'] = 20.0  # Invalid

        errors = ScenarioValidator.validate_first_innings_curtailed(inputs)
        self.assertIn('overs_used_by_team_1_during_curtailed', errors)
        self.assertEqual(
            errors['overs_used_by_team_1_during_curtailed'][0], 
            "Must be lesser than oversAvailableToTeam1AtStart"
        )

    def test_validator_logic_team2_overs_vs_team1_start(self):
        """
        Test logic: Team 2 overs cannot be >= Team 1 start overs.
        This covers the first validation branch in ScenarioValidator.
        """
        inputs = self.base_inputs.copy()
        inputs['overs_available_to_team_1_at_start'] = 20.0
        inputs['overs_available_to_team_2_at_start'] = 20.0
        inputs['overs_used_by_team_1_during_curtailed'] = 20.0

        errors = ScenarioValidator.validate_first_innings_curtailed(inputs)

        self.assertIn('overs_available_to_team_2_at_start', errors)
        self.assertEqual(
            errors['overs_available_to_team_2_at_start'][0],
            "Must be less than oversAvailableToTeam1AtStart"
        )
