from .enums import DLSScenarioEnum
from calculators.dls_calculator import DLSCalculator
from rest_framework.exceptions import ValidationError
from typing import Dict, Callable


class DLSService:

    def __init__(self):
        self.calculator = DLSCalculator()
        self.scenario_map: Dict[str, Callable] = {
            DLSScenarioEnum.FIRST_INNINGS_CURTAILED.value: self.calculator.calculate_par_score_first_innings_cut_short,
            DLSScenarioEnum.FIRST_INNINGS_INTERRUPTED.value: self.calculator.calculate_par_score_first_innings_interrupted,
            DLSScenarioEnum.SECOND_INNINGS_CURTAILED.value: self.calculator.calculate_par_score_second_innings_cut_short,
            DLSScenarioEnum.SECOND_INNINGS_DELAYED.value: self.calculator.calculate_par_score_second_innings_delayed,
            DLSScenarioEnum.SECOND_INNINGS_INTERRUPTED.value: self.calculator.calculate_par_score_second_innings_interrupted,
        }

    def calculate(self, validated_data: Dict[str, str]) -> int:
        scenario = validated_data.get("scenario_type")
        match_format = validated_data.get("match_format")  # Placeholder for future ODI&T10 logic
        inputs: Dict[str, str] = validated_data.get("inputs", {})

        calculator_method: Callable = self.scenario_map[scenario]

        return round(calculator_method(**inputs))
