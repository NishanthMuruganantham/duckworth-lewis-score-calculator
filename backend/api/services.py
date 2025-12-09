from .enums import DLSScenarioEnum
from calculators.dls_calculator import DLSCalculator
from rest_framework.exceptions import ValidationError


class DLSService:
    
    def __init__(self):
        self.calculator = DLSCalculator()
        self.scenario_map = {
            DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value: self.calculator.calculate_par_score_first_innings_cut_short,
            DLSScenarioEnum.FIRST_INNINGS_INTERRUPTED.value: self.calculator.calculate_par_score_first_innings_interrupted,
            DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value: self.calculator.calculate_par_score_second_innings_cut_short,
            DLSScenarioEnum.SECOND_INNINGS_DELAYED.value: self.calculator.calculate_par_score_second_innings_delayed,
            DLSScenarioEnum.SECOND_INNINGS_INTERRUPTED.value: self.calculator.calculate_par_score_second_innings_interrupted,
        }

    def calculate(self, validated_data):
        scenario = validated_data.get("dls_scenario")
        calculator_method = self.scenario_map.get(scenario)

        if not calculator_method:
            raise ValidationError({"dls_scenario": [f"Invalid scenario: {scenario}"]})

        return calculator_method(**validated_data)
